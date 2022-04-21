import type { TemplateOperatorConfig, ValueType } from '../types/index'

export class TemplateOperator {
  private config

  constructor(config: TemplateOperatorConfig) {
    this.config = config
  }

  calc(strings: TemplateStringsArray, ...arg: ValueType[]) {
    const len = strings.length

    // TODO: Operator Weight Judgment
    return strings.reduce((all, item, index) => {
      const _item = item.trim()
      if (_item) {
        return this.config.operator(_item, all, arg[index])
      } else if (index !== 0 && index !== len - 1) {
        console.warn('miss operator')
      }
      return all
    }, arg[0])
  }

  // TODO: add more operations, eg: compare? ...
}
