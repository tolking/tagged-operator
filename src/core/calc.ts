import { precedenceToRegExp } from '../utils/index'
import type { TemplateOperatorConfig, ValueType } from '../types/index'

/**
 * Create a calculator that executes with precedence and grouping operators `()`.
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
 *  calc`${1} + ${2} * ${3}` // 1 + 2 * 3
 *  calc`(${5} + ${3}) * ${4}` // (5 + 3) * 4
 *  calc`(-(${5} + ${3}) * ${4} + ${8}) - ${6} / ${2}` // (-(5 + 3) * 4 + 8) - 6 / 2
 * ```
 */
export function createCalc(config: TemplateOperatorConfig) {
  const precedenceClac = createPrecedenceCalc(config)

  return (strings: TemplateStringsArray, ...arg: ValueType[]) => {
    // If the operator does not contain `(` `)`, call the `createPrecedenceCalc` directly
    if (!/[(|)]/.test(strings.join(''))) {
      return precedenceClac(strings as unknown as TemplateStringsArray, ...arg)
    }

    // The `_` variables indicate related data to be calculated
    // operator to be processed
    const _strings = [...strings]
    // values to be processed
    const _values = [...arg]
    // Record the number of grouping operators at the corresponding `_strings` position. positive number: `(`, negative number: `)`.
    const _grouping: Array<number | undefined> = []

    // `index` for `strings ...`, _index for `_strings ...`
    for (let index = 0, _index = 0; index < strings.length; index++, _index++) {
      // current operator
      const item = strings[index]
      const hasGrouping = /[(|)]/.test(item)

      // The grouping operators have the highest precedence
      if (hasGrouping) {
        const left = item.split('(')
        const right = item.split(')')

        if (left.length > 1 && right.length > 1 && /\(.*\)/.test(item)) {
          const err = new Error(`can not use () in one operator: ${item}`)
          console.warn(err)
        }
        _grouping[_index] = left.length - 1 - (right.length - 1)

        // Start evaluating grouping operators when the current operator includes `)`.
        // There may be multiple `)`, so here one by one eliminates the `)`.
        while (right.length > 1) {
          let lIndex = _index - 1
          // Find the nearest closing `(` to the left
          while (lIndex >= 0) {
            if (_grouping[lIndex]) break
            if (lIndex === 0)
              console.warn('a error way to used grouping operator ' + item)
            lIndex--
          }

          // There may also be an operator in a grouping operators, get it here
          const lItem = _strings[lIndex].split('(')
          const lOperator = lItem[lItem.length - 1].trim()
          const rOperator = right[0].trim()
          // Operators remaining after eliminating grouping operators being evaluated
          const lItemRemain = lItem.slice(0, lItem.length - 1).join('(')
          const rItemRemain = right.slice(1, right.length).join(')')

          // Extract the operator, variable, and precedence information contained in grouping operators and start the calculation.
          const operators = [
            lOperator,
            ..._strings.slice(lIndex + 1, _index),
            rOperator,
          ]
          const values = _values.slice(lIndex, _index)
          const result = precedenceClac(
            operators as unknown as TemplateStringsArray,
            ...values
          )

          // Modify the `_` variables value after the calculation is complete.
          _strings.splice(lIndex, _index - lIndex + 1, lItemRemain, rItemRemain)
          _values.splice(lIndex, _index - lIndex, result)
          _grouping.splice(
            lIndex,
            _index - lIndex + 1,
            (_grouping[lIndex] as number) - 1,
            (_grouping[_index] as number) + 1
          )
          _index = lIndex + 1

          // eliminates the first `)`
          right.shift()
        }
      }
    }

    // Calculate the remainder when the last item is reached
    // It's all at the end, of course there can't have grouping operators.
    const _gIndex = _grouping.findIndex((item) => item)

    if (_gIndex > -1) {
      throw new Error(
        `a error way to used grouping operator ${strings[_gIndex]}`
      )
    }

    return precedenceClac(
      _strings as unknown as TemplateStringsArray,
      ..._values
    )
  }
}

/**
 * Create a calculator that only includes precedence information, *without grouping operators `()`*
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
 *  calc`${1} + ${2} * ${3}` // 1 + 2 * 3
 *  calc`${3} + ${4}!` // 3 + 4!
 * ```
 */
export function createPrecedenceCalc({
  operator,
  precedence,
}: TemplateOperatorConfig) {
  const pipeClac = createPipeCalc({ operator })
  // When not contain any precedence, call the `createPipeCalc` directly.
  if (!precedence) return pipeClac
  // Match operator by RegExp
  const precedenceRegExp = precedenceToRegExp(precedence)

  return (strings: TemplateStringsArray, ...arg: ValueType[]) => {
    const _strings = [...strings]
    // Record the number of precedence at the corresponding `_strings` position.
    const _precedence: Array<number | undefined> = []
    let len = 0

    precedenceRegExp &&
      strings.forEach((operator, index) => {
        for (const key in precedenceRegExp) {
          const regExp = precedenceRegExp[key]

          if (regExp.test(operator.trim())) {
            len++
            _precedence[index] = parseFloat(key)
          }
        }
      })

    while (len > 0) {
      let index = 0
      let max = Number.MIN_SAFE_INTEGER
      // Find the index with the highest precedence
      _precedence.forEach((item, i) => {
        if (item !== undefined && item > max) {
          max = item
          index = i
        }
      })

      const result = operator(
        _strings[index].trim(),
        arg[index - 1],
        arg[index]
      )

      _strings.splice(index, 1)
      arg.splice(index - 1, 2, result)
      _precedence.splice(index, 1)
      len--
    }

    // the remain calculated by `createPipeCalc`
    return pipeClac(_strings as unknown as TemplateStringsArray, ...arg)
  }
}

/**
 * Create a calculator that executes sequentially
 * @param config.operator How the match operator is evaluated
 *
 * eg:
 *
 * ```
 *    const operator = (type, val1, val2) => {
 *      if (type === '|>') {
 *        return val2(val1)
 *      } else {
 *        console.warn(`the type most be '|>', bug get ${type}`)
 *      }
 *    }
 *    const calc = createPipeCalc({ operator })
 *
 *    calc`${value} |> ${funa} |> ${funb}` // same as funb(funa(value))
 * ```
 */
export function createPipeCalc({ operator }: TemplateOperatorConfig) {
  return (strings: TemplateStringsArray, ...arg: ValueType[]) => {
    const len = strings.length
    return strings.reduce((all, item, index) => {
      const _item = item.trim()
      if (_item) {
        return operator(_item, all, arg[index])
      } else if (index !== 0 && index !== len - 1) {
        console.warn('miss operator')
      } else if (index === 0) {
        all = arg[index]
      }
      return all
    }, undefined as ValueType)
  }
}
