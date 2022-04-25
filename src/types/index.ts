// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValueType = any

/**
 * How the match operator is evaluated
 * @param type current operator
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
 * By default, only contains grouping operators `()`. **Cannot use `(` and `)` in custom operators**
 *
 * When value is false, will not contain any precedence. just return `createPipeCalc()`
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
export type Precedence = Record<number, string[]> | undefined | false

export interface TemplateOperatorConfig {
  operator: Operator
  precedence: Precedence
}
