import { Cache, precedenceToRegExp, throwError } from '../utils/index'
import type { Config, ValueType } from '../types/index'

/**
 * Create a tagged calculator that executes with precedence and grouping operators `()`.
 * @param config.operator How the match operator is evaluated
 * @param config.precedence Configure operator precedence information
 *
 * eg:
 *
 * ```
 *  const precedence = { 2: ['!'], 1: ['*', '/'] }
 *  const factorial = (num, total) => {
 *    if (num <= 1) return total * 1
 *    return factorial(num - 1, total * (num - 1))
 *  }
 *  const operator = (type, val1, val2) => {
 *    switch (type) {
 *      case '+':
 *        return val1 + val2
 *      case '-':
 *        return (val1 ?? 0) - val2
 *      case '*':
 *        return val1 * val2
 *      case '/':
 *        return val1 / val2
 *      case '!':
 *        return factorial(val1)
 *      default:
 *        console.warn(`no operator configured: ${type}`)
 *    }
 *  }
 *
 *  const calc = createTag({ operator, precedence })
 *
 *  calc`${1} + ${2} * ${3}` // 1 + 2 * 3
 *  calc`(${5} + ${3}) * ${4}` // (5 + 3) * 4
 *  calc`(-(${5} + ${3}) * ${4} + ${8}) - ${6} / ${2}` // (-(5 + 3) * 4 + 8) - 6 / 2
 * ```
 */
export function createTag<T = ValueType, Q = T>(config: Config<T, Q>) {
  const precedenceCalc = createPrecedenceTag<T, Q>(config)

  return (strings: TemplateStringsArray, ...arg: T[]) => {
    // If the operator does not contain `(` `)`, call the `createPrecedenceTag` directly
    if (!/[(|)]/.test(strings.join(''))) return precedenceCalc(strings, ...arg)
    // Store the data to be calculated through the Cache
    const cache = new Cache<{ operators: string[]; values: T[] }>()

    for (let index = 0, len = strings.length; index < len; index++) {
      const item = strings[index]
      const hasGrouping = /[(|)]/.test(item)

      // The grouping operators have the highest precedence
      if (hasGrouping) {
        if (/\(.*\)/.test(item)) {
          throwError(
            `Can not use grouping operators within an operator, current operator ${item}`
          )
        }
        const right = item.split(')')
        // Eliminates the `)` have the highest precedence
        while (right.length > 1) {
          const { operators, values } = cache.getCurrent()
          const _operators = [
            ...operators,
            right[0],
          ] as unknown as TemplateStringsArray
          const result = precedenceCalc(_operators, ...values) as unknown as T

          cache.remove()
          cache.setCurrent((pre) => ({
            operators: pre?.operators || [],
            values: [...(pre?.values || []), result],
          }))
          //  eliminates the first `)`
          right.shift()
        }

        const left = right[0].split('(')

        if (left.length > 1) {
          // After split `(`, the first item operator is distributed to the current, and the rest will add corresponding cache items respectively.
          cache.setCurrent((pre) => ({
            operators: [...(pre?.operators || []), left[0]],
            values: pre?.values || [],
          }))
          left.shift()
          cache.add(
            ...left.map((item, i) => ({
              operators: [item],
              values: left.length - 1 === i ? [arg[index]] : [],
            }))
          )
        } else {
          cache.setCurrent((pre) => ({
            operators: [...(pre?.operators || []), right[0]],
            values: [...(pre?.values || []), arg[index]],
          }))
        }
      } else {
        cache.setCurrent((pre) => ({
          operators: [...(pre?.operators || []), item],
          values:
            len - 1 !== index
              ? [...(pre?.values || []), arg[index]]
              : pre?.values || [],
        }))
      }
    }

    // Calculate the remainder when the last item is reached
    // It's all at the end, of course there can't have grouping operators.
    if (cache.length() > 1) throwError('A error way to used grouping operator')

    const { operators, values } = cache.getCurrent()

    return precedenceCalc(
      operators as unknown as TemplateStringsArray,
      ...values
    )
  }
}

/**
 * Create a tagged calculator that only includes precedence information, *without grouping operators `()`*
 * @param config.operator How the match operator is evaluated
 * @param config.precedence Configure operator precedence information
 *
 * eg:
 *
 * ```
 *  const precedence = { 2: ['!'], 1: ['*', '/'] }
 *  const factorial = (num, total) => {
 *    if (num <= 1) return total * 1
 *    return factorial(num - 1, total * (num - 1))
 *  }
 *  const operator = (type, val1, val2) => {
 *    switch (type) {
 *      case '+':
 *        return val1 + val2
 *      case '-':
 *        return (val1 ?? 0) - val2
 *      case '*':
 *        return val1 * val2
 *      case '/':
 *        return val1 / val2
 *      case '!':
 *        return factorial(val1)
 *      default:
 *        console.warn(`no operator configured: ${type}`)
 *    }
 *  }
 *
 *  const calc = createTag({ operator, precedence })
 *
 *  calc`${1} + ${2} * ${3}` // 1 + 2 * 3
 *  calc`${3} + ${4}!` // 3 + 4!
 * ```
 */
export function createPrecedenceTag<T = ValueType, Q = T>({
  operator,
  precedence,
}: Config<T, Q>) {
  if (!operator) throwError('The operator config is required')

  const pipeCalc = createPipeTag<T, Q>({ operator })
  // When not contain any precedence, call the `createPipeTag` directly.
  if (!precedence) return pipeCalc
  // Match operator by RegExp
  const precedenceRegExp = precedenceToRegExp(precedence)

  return (strings: TemplateStringsArray, ...arg: T[]) => {
    const _strings = [...strings]

    // Calculate items with precedence
    function calcPrecedence(regExp: RegExp) {
      let index = 0

      while (index < _strings.length) {
        const item = _strings[index].trim()

        if (regExp.test(item)) {
          const result = operator(
            item,
            arg[index - 1],
            arg[index]
          ) as unknown as T

          _strings.splice(index, 1)
          arg.splice(index - 1, 2, result)
        } else {
          index++
        }
      }
    }

    precedenceRegExp &&
      Object.entries(precedenceRegExp)
        .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
        .forEach(([, regExp]) => calcPrecedence(regExp))

    // the remain calculated by `createPipeTag`
    return pipeCalc(_strings as unknown as TemplateStringsArray, ...arg)
  }
}

/**
 * Create a tagged calculator that executes sequentially
 * @param config.operator How the match operator is evaluated
 *
 * eg:
 *
 * ```
 *    const operator = (type, val1, val2) => {
 *      if (type === '|>') {
 *        return val2(val1)
 *      } else {
 *        console.warn(`the operator most be '|>', bug get ${type}`)
 *      }
 *    }
 *    const calc = createPipeTag({ operator })
 *
 *    calc`${value} |> ${funa} |> ${funb}` // same as funb(funa(value))
 * ```
 */
export function createPipeTag<T = ValueType, Q = T>({
  operator,
}: Config<T, Q>) {
  if (!operator) throwError('The operator config is required')

  return (strings: TemplateStringsArray, ...arg: T[]) => {
    const len = strings.length

    return strings.reduce((all, item, index) => {
      const _item = item.trim()

      if (_item) {
        return operator(_item, all, arg[index])
      } else if (index !== 0 && index !== len - 1) {
        throwError(`The operator may be missing before the value ${arg[index]}`)
      } else if (index === 0) {
        all = arg[index]
      }

      return all
    }, undefined as unknown as T | Q) as Q
  }
}
