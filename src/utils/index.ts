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
      console.warn(`empt: ${key}: ${value}`)
    }
    result[key] = RegExp(`^[${value.join('|')}]$`)
  }

  return result
}
