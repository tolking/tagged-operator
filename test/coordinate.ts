import { TemplateOperator } from '../src/index'
import type { Operator } from '../src/index'

export class Coordinate extends TemplateOperator {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    super({ operator, precedence: false })
    this.x = x
    this.y = y
  }
}

const operator: Operator = (type, val1, val2) => {
  switch (type) {
    case '+':
      if (!(val1 instanceof Coordinate && val2 instanceof Coordinate)) {
        console.warn('different types, can not use +')
        break
      }
      return new Coordinate(val1.x + val2.x, val1.y + val2.y)
    case '-':
      if (val1 && val2) {
        if (!(val1 instanceof Coordinate && val2 instanceof Coordinate)) {
          console.warn('different types, can not use -')
          break
        }
        return new Coordinate(val1.x - val2.x, val1.y - val2.y)
      } else if (val2) {
        if (!(val2 instanceof Coordinate)) {
          console.warn('the arg should be Coordinate')
          break
        }
        return new Coordinate(-val2.x, -val2.y)
      } else {
        console.warn('miss value')
        break
      }
    case '*':
      return new Coordinate(val1.x * val2, val1.y * val2)
    case '/':
      return new Coordinate(val1.x / val2, val1.y / val2)
    default:
      console.warn(`no operator configured: ${type}`)
      break
  }
}
