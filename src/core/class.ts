import { createTag, createPrecedenceTag, createPipeTag } from './index'
import type { Config, ValueType } from '../types/index'

/**
 * Create a tagged calculator through class
 *
 * eg: [demo](https://github.com/tolking/tagged-operator/blob/main/src/core/class.test.ts)
 *
 * ```
 *  const operator = (type, val1, val2) => {
 *    //...
 *  }
 *  const precedence = {
 *    //...
 *  }
 *
 *  class Coordinate extends TaggedOperator {
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
export class TaggedOperator<T = ValueType, Q = T> {
  public calc

  constructor(config: Config<T, Q>) {
    if (config.type === 'pipe') {
      this.calc = createPipeTag<T, Q>(config)
    } else if (config.type === 'precedence') {
      this.calc = createPrecedenceTag<T, Q>(config)
    } else {
      this.calc = createTag<T, Q>(config)
    }
  }
}
