import { createCalc, createPipeCalc } from './index'
import type { TemplateOperatorConfig } from '../types/index'

/**
 * Implementing template calculations through class
 *
 * eg:
 *
 * ```
 *  const operator = (type, val1, val2) => {
 *    //...
 *  }
 *  const precedence = {
 *    //...
 *  }
 *
 *  class Coordinate extends TemplateOperator {
 *    constructor(x: number, y: number) {
 *      super({ operator, precedence })
 *      this.x = x
 *      this.y = y
 *    }
 *  }
 *
 *  const a = new Coordinate(100, 100)
 *  const b = new Coordinate(0, 200)
 *
 *  a.calc`${a} + ${b}` // Coordinate { x: 100, y: 300 }
 * ```
 */
export class TemplateOperator {
  public calc

  constructor(config: TemplateOperatorConfig) {
    this.calc =
      config.precedence === false ? createPipeCalc(config) : createCalc(config)
    // TODO: add more operations, eg: compare? ...
  }
}
