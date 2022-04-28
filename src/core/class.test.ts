import { describe, test, expect } from 'vitest'
import { TaggedOperator } from './index'
import type { Operator, Precedence } from '../types/index'

export class Coordinate extends TaggedOperator<
  Coordinate | number,
  Coordinate
> {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    super({ operator, precedence })
    this.x = x
    this.y = y
  }
}

const precedence: Precedence = {
  1: ['*', '/'],
}

const operator: Operator<Coordinate | number, Coordinate> = (
  type,
  val1,
  val2
) => {
  switch (type) {
    case '+':
      if (!(val1 instanceof Coordinate && val2 instanceof Coordinate)) {
        console.warn('different types, can not use +')
        return val1 as Coordinate
      }
      return new Coordinate(val1.x + val2.x, val1.y + val2.y)
    case '-':
      if (val1 && val2) {
        if (!(val1 instanceof Coordinate && val2 instanceof Coordinate)) {
          console.warn('different types, can not use -')
          return val1 as Coordinate
        }
        return new Coordinate(val1.x - val2.x, val1.y - val2.y)
      } else if (val2) {
        if (!(val2 instanceof Coordinate)) {
          console.warn('the arg should be Coordinate')
          return val1 as Coordinate
        }
        return new Coordinate(-val2.x, -val2.y)
      } else {
        console.warn('miss value')
        return val1 as Coordinate
      }
    case '*':
      if (val1 instanceof Coordinate && val2 instanceof Coordinate) {
        return new Coordinate(val1.x * val2.x, val1.y * val2.y)
      } else if (val1 instanceof Coordinate && typeof val2 === 'number') {
        return new Coordinate(val1.x * val2, val1.y * val2)
      } else if (typeof val1 === 'number' && val2 instanceof Coordinate) {
        return new Coordinate(val1 * val2.x, val1 * val2.y)
      } else {
        return val1 as Coordinate
      }
    case '/':
      if (val1 instanceof Coordinate && val2 instanceof Coordinate) {
        return new Coordinate(val1.x / val2.x, val1.y / val2.y)
      } else if (val1 instanceof Coordinate && typeof val2 === 'number') {
        return new Coordinate(val1.x / val2, val1.y / val2)
      } else if (typeof val1 === 'number' && val2 instanceof Coordinate) {
        return new Coordinate(val1 / val2.x, val1 / val2.y)
      } else {
        return val1 as Coordinate
      }
    default:
      console.warn(`no operator configured: ${type}`)
      return val1 as Coordinate
  }
}

describe('coordinate calc', () => {
  const a = new Coordinate(100, 100)
  const b = new Coordinate(0, 200)

  test.concurrent('+', () => {
    const result = a.calc`${a} + ${b}`

    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(Coordinate)
    expect(result.x).toBe(100)
    expect(result.y).toBe(300)
  })

  test.concurrent('-', () => {
    const result = a.calc`${a} - ${b}`

    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(Coordinate)
    expect(result.x).toBe(100)
    expect(result.y).toBe(-100)
  })

  test.concurrent('*', () => {
    const result = a.calc`${a} * ${3}`

    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(Coordinate)
    expect(result.x).toBe(300)
    expect(result.y).toBe(300)
  })

  test.concurrent('/', () => {
    const result = a.calc`${a} / ${2}`

    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(Coordinate)
    expect(result.x).toBe(50)
    expect(result.y).toBe(50)
  })

  test.concurrent('a * 3 - b', () => {
    const result = a.calc`${a} * ${3} - ${b}`

    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(Coordinate)
    expect(result.x).toBe(300)
    expect(result.y).toBe(100)
  })

  test.concurrent('-a', () => {
    const result = a.calc`-${a}`

    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(Coordinate)
    expect(result.x).toBe(-100)
    expect(result.y).toBe(-100)
  })

  test.concurrent('-a - b', () => {
    const result = a.calc`-${a} - ${b}`

    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(Coordinate)
    expect(result.x).toBe(-100)
    expect(result.y).toBe(-300)
  })

  test.concurrent('a - b * 3', () => {
    const result = a.calc`${a} - ${b} * ${3}`

    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(Coordinate)
    expect(result.x).toBe(100)
    expect(result.y).toBe(-500)
  })

  test.concurrent('(a - b) * 3', () => {
    const result = a.calc`(${a} - ${b}) * ${3}`

    expect(result).toBeDefined()
    expect(result).toBeInstanceOf(Coordinate)
    expect(result.x).toBe(300)
    expect(result.y).toBe(-300)
  })
})
