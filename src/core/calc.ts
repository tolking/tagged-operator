import type { TemplateOperatorConfig, ValueType } from '../types/index'

export function createCalc(config: TemplateOperatorConfig) {
  // TODO: Operator Weight Judgment
  return createPipeCalc(config)
}

export function createPipeCalc({
  operator,
}: Pick<TemplateOperatorConfig, 'operator'>) {
  return (strings: TemplateStringsArray, ...arg: ValueType[]) => {
    const len = strings.length
    return strings.reduce((all, item, index) => {
      const _item = item.trim()
      if (_item) {
        return operator(_item, all, arg[index])
      } else if (index !== 0 && index !== len - 1) {
        console.warn('miss operator')
      }
      return all
    }, arg[0])
  }
}
