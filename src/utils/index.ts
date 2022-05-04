import type { Precedence, ValueType } from '../types/index'

/**
 * Convert the operator precedence information to regular, to match operator
 * @param precedence the operator precedence information from config
 */
export function precedenceToRegExp(precedence: Precedence) {
  if (!precedence) return undefined
  const result: Record<number, RegExp> = {}

  for (const key in precedence) {
    const value = precedence[key]

    if (!value.length) {
      throwWarn(`The precedence config is empty, ${key}: ${value}`)
      continue
    }
    result[key] = RegExp(`^[${value.join('|')}]$`)
  }

  return result
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

/** Cache data by an Array */
export class Cache<T = ValueType> {
  public value: Array<T> = []

  /** The cache data length */
  length() {
    return this.value.length
  }

  /** Whether the cached data is empty */
  isEmpt() {
    return !this.length()
  }

  /**
   * Get an arbitrary cached value
   * @param index index of cache
   */
  get(index: number) {
    return this.value[index]
  }

  /**
   * Set an arbitrary cached value
   * @param index index of cache
   * @param result a value or a function
   */
  set(index: number, result: T | ((val: T) => T)) {
    const _value = isFunction(result) ? result(this.get(index)) : result
    this.value[index] = _value
  }

  /** The current index （the last item saved） */
  current() {
    return Math.max(0, this.length() - 1)
  }

  /** Get current item value（the last item saved） */
  getCurrent() {
    const index = this.current()
    return this.value[index]
  }

  /**
   * Set current item value（the last item saved）
   * @param result a value or a function
   */
  setCurrent(result: T | ((val: T) => T)) {
    const index = this.current()
    const _value = isFunction(result) ? result(this.getCurrent()) : result
    this.value[index] = _value
  }

  /**
   * Add one or more cache values
   * @param arg values
   */
  add(...arg: T[]) {
    this.value = this.value.concat(arg)
  }

  /**
   * Remove data from cache
   * @param index index of cache, default: the last one
   * @param count How many data will be deleted, default: 1
   */
  remove(index?: number, count = 1) {
    index ? this.value.splice(index, count) : this.value.pop()
  }
}

/**
 * throw an error
 * @param message Error message
 */
export function throwError(message: string) {
  throw new Error(`TaggedOperator Error: ${message}`)
}

/**
 * throw a warn
 * @param message warn message
 */
export function throwWarn(message: string) {
  console.warn(`TaggedOperator Warn: ${message}`)
}
