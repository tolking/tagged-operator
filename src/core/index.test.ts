import { describe, test, expect } from 'vitest'
import { Operator } from '../index'
import { createPipeCalc } from './index'

const factorial = (num: number, total = num): number => {
  if (num <= 1) return total * 1
  return factorial(num - 1, total * (num - 1))
}
const operator: Operator = (type, val1, val2) => {
  switch (type) {
    case '+':
      return val1 + val2
    case '-':
      return (val1 ?? 0) - val2
    case '*':
      return val1 * val2
    case '/':
      return val1 / val2
    case '!':
      return factorial(val1)
    default:
      return val1
  }
}

describe('createPipeCalc', () => {
  const calc = createPipeCalc({ operator })

  test.concurrent('1 + 2', () => {
    expect(calc`${1} + ${2}`).toBe(1 + 2)
  })
  test.concurrent('10 - 2', () => {
    expect(calc`${10} - ${2}`).toBe(10 - 2)
  })
  test.concurrent('-5', () => {
    expect(calc`-${5}`).toBe(-5)
  })
  test.concurrent('-5 + 2', () => {
    expect(calc`-${5} + ${2}`).toBe(-5 + 2)
  })
  test.concurrent('4!', () => {
    expect(calc`${4}!`).toBe(4 * 3 * 2 * 1)
  })
})
