import { createCalc } from './index'
import type { TemplateOperatorConfig } from '../types/index'

export class TemplateOperator {
  public calc

  constructor(config: TemplateOperatorConfig) {
    this.calc = createCalc(config)
    // TODO: add more operations, eg: compare? ...
  }
}
