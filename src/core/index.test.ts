import { describe, test, expect } from 'vitest'
import { createTag, createPrecedenceTag, createPipeTag } from './index'
import type { Operator, Precedence } from '../index'

const precedence: Precedence = { 2: ['!'], 1: ['*', '/'] }
const factorial = (num: number, total = num): number => {
  if (num <= 1) return total * 1
  return factorial(num - 1, total * (num - 1))
}
const operator: Operator<number> = (type, val1, val2) => {
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
      console.warn(`no operator configured: ${type}`)
      return val1
  }
}

describe('createPipeTag', () => {
  const calc = createPipeTag({ operator })

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

describe('createPrecedenceTag', () => {
  const calc = createPrecedenceTag({ operator, precedence })

  test.concurrent('1 + 2 * 3', () => {
    expect(calc`${1} + ${2} * ${3}`).toBe(1 + 2 * 3)
  })

  test.concurrent('5 + 3 * 4 + 8 - 6 / 2', () => {
    expect(calc`${5} + ${3} * ${4} + ${8} - ${6} / ${2}`).toBe(
      5 + 3 * 4 + 8 - 6 / 2
    )
  })

  test.concurrent('3 + 4!', () => {
    expect(calc`${3} + ${4}!`).toBe(3 + factorial(4))
  })
})

describe('createTag', () => {
  const calc = createTag({ operator, precedence })

  test.concurrent('(5 + 3)', () => {
    expect(calc`(${5} + ${3})`).toBe(5 + 3)
  })

  test.concurrent('(5 + 3) * 4', () => {
    expect(calc`(${5} + ${3}) * ${4}`).toBe((5 + 3) * 4)
  })

  test.concurrent('5 + 3 * 4 + (8 - 6) / 2', () => {
    expect(calc`${5} + ${3} * ${4} + (${8} - ${6}) / ${2}`).toBe(
      5 + 3 * 4 + (8 - 6) / 2
    )
  })

  test.concurrent('(5 + 3) * 4 + (8 - 6) / 2', () => {
    expect(calc`(${5} + ${3}) * ${4} + (${8} - ${6}) / ${2}`).toBe(
      (5 + 3) * 4 + (8 - 6) / 2
    )
  })

  test.concurrent('((5 + 3) * 4 + (8 - 6)) / 2', () => {
    expect(calc`((${5} + ${3}) * ${4} + (${8} - ${6})) / ${2}`).toBe(
      ((5 + 3) * 4 + (8 - 6)) / 2
    )
  })

  test.concurrent('5 + 3 * (4 + (8 - 6)) / 2', () => {
    expect(calc`${5} + ${3} * (${4} + (${8} - ${6})) / ${2}`).toBe(
      5 + (3 * (4 + (8 - 6))) / 2
    )
  })

  test.concurrent('-(5 + 3) * 4 + 8 - 6 / 2', () => {
    expect(calc`-(${5} + ${3}) * ${4} + ${8} - ${6} / ${2}`).toBe(
      -(5 + 3) * 4 + 8 - 6 / 2
    )
  })

  test.concurrent('(-(5 + 3) * 4 + 8) - 6 / 2', () => {
    expect(calc`(-(${5} + ${3}) * ${4} + ${8}) - ${6} / ${2}`).toBe(
      -(5 + 3) * 4 + 8 - 6 / 2
    )
  })

  test.concurrent('-(-(5 + 3) * 4 + 8) - 6 / 2', () => {
    expect(calc`-(-(${5} + ${3}) * ${4} + ${8}) - ${6} / ${2}`).toBe(
      -(-(5 + 3) * 4 + 8) - 6 / 2
    )
  })

  test.concurrent('5 + 3 * (4 + 8 - 6) / 2', () => {
    expect(calc`${5} + ${3} * (${4} + ${8} - ${6}) / ${2}`).toBe(
      5 + (3 * (4 + 8 - 6)) / 2
    )
  })

  test.concurrent('5 + 3 * ( -(4 + 8 - 6)) / 2', () => {
    expect(calc`${5} + ${3} * ( -(${4} + ${8} - ${6})) / ${2}`).toBe(
      5 + (3 * -(4 + 8 - 6)) / 2
    )
  })

  test.concurrent('(5 + 3) * ( -(4 + 8 - 6)) / 2', () => {
    expect(calc`(${5} + ${3}) * ( -(${4} + ${8} - ${6})) / ${2}`).toBe(
      ((5 + 3) * -(4 + 8 - 6)) / 2
    )
  })

  test.concurrent('(5 + 3) * (4 + 8) - 6 / 2', () => {
    expect(calc`(${5} + ${3}) * (${4} + ${8}) - ${6} / ${2}`).toBe(
      (5 + 3) * (4 + 8) - 6 / 2
    )
  })

  test.concurrent('(5 + 3) * ((4 + 8) - 6) / 2', () => {
    expect(calc`(${5} + ${3}) * ((${4} + ${8}) - ${6}) / ${2}`).toBe(
      ((5 + 3) * (4 + 8 - 6)) / 2
    )
  })

  test.concurrent('5 + 3 * ((4 + 8 - 6)! ) / 2', () => {
    expect(calc`${5} + ${3} * ((${4} + ${8} - ${6})! ) / ${2}`).toBe(
      5 + (3 * factorial(4 + 8 - 6)) / 2
    )
  })
})
