// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValueType = any

export type Operator = (
  type: string,
  val1: ValueType,
  val2: ValueType
) => ValueType

export interface TemplateOperatorConfig {
  operator: Operator
}
