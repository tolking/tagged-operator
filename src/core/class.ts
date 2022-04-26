import { createCalc, createPrecedenceCalc, createPipeCalc } from './index'
import type { TemplateOperatorConfig } from '../types/index'

/**
 * Implementing template calculations through class
 *
 * eg: [demo](https://github.com/tolking/template-operator/blob/main/src/core/class.test.ts)
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
    if (config.type === 'pipe') {
      this.calc = createPipeCalc(config)
    } else if (config.type === 'precedence') {
      this.calc = createPrecedenceCalc(config)
    } else {
      this.calc = createCalc(config)
    }
  }
}
