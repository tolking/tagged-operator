import type { Precedence } from '../types/index'

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
