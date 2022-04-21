import { TemplateOperator } from '../src/index'
import type { Operator } from '../src/index'

export class Coordinate extends TemplateOperator {
  x: number
  y: number

  constructor(x: number, y: number) {
    super({ operator })
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
      if (!(val1 instanceof Coordinate && val2 instanceof Coordinate)) {
        console.warn('different types, can not use -')
        break
      }
      return new Coordinate(val1.x - val2.x, val1.y - val2.y)
    case '*':
      return new Coordinate(val1.x * val2, val1.y * val2)
    case '/':
      return new Coordinate(val1.x / val2, val1.y / val2)
    default:
      console.warn(`no operator configured: ${type}`)
      break
  }
}
