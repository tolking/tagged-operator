import { describe, test, expect } from 'vitest'
import { Coordinate } from './coordinate'

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
})
