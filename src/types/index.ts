// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValueType = any

/**
 * How the match operator is evaluated
 * @param type current operator (Note: prohibited to use `(` and `)` when `config.type` is `default`)
 * @param val1 the value to the left of the current operator
 * @param val2 the value to the right of the current operator
 */
export type Operator = (
  type: string,
  val1: ValueType,
  val2: ValueType
) => ValueType

/**
 * Configure operator precedence information.
 *
 * The larger the key, the higher the precedence. For performance reasons, you should only config operators that need to be evaluated first.
 *
 * eg:
 *
 * ```
 *    const precedence = {
 *      2: ['^'],
 *      1: ['*', '/'],
 *    }
 * ```
 */
export type Precedence = Record<number, string[]>

export interface TemplateOperatorConfig {
  /**
   * how to calculate
   *
   * `default` - the config operator precedence information and grouping operators `()`.
   *
   * `precedence` - just used the config operator precedence information.
   *
   * `pipe` - executes sequentially.
   */
  type?: 'default' | 'precedence' | 'pipe'
  /** How the match operator is evaluated */
  operator: Operator
  /** Configure operator precedence information */
  precedence?: Precedence
}
