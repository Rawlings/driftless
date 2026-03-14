import { extractNumericRange, inferSyntaxFamilies, type SyntaxFamily } from './propertySyntaxClassifier'

export type PropertyControlType = 'number' | 'unit-number' | 'slider' | 'color' | 'select' | 'text'
export type UnitValueType = 'length' | 'length-percentage' | 'percentage' | 'time' | 'angle'

export interface PropertyControlConfig {
  controlType: PropertyControlType
  min?: number
  max?: number
  step?: number
  options?: string[]
  unitType?: UnitValueType
  units?: string[]
  defaultUnit?: string
}

interface InferControlConfigParams {
  property: string
  syntax: string
  options?: string[]
}

interface MappingContext {
  property: string
  syntax: string
  families: Set<SyntaxFamily>
  options?: string[]
  range: { min?: number; max?: number }
}

interface MappingRule {
  name: string
  when: (context: MappingContext) => boolean
  map: (context: MappingContext) => PropertyControlConfig
}

const UNIT_CONFIGS: Record<UnitValueType, { units: string[]; defaultUnit: string; step: number }> = {
  'length': {
    units: ['px', 'rem', 'em', 'vw', 'vh'],
    defaultUnit: 'px',
    step: 1
  },
  'length-percentage': {
    units: ['px', '%', 'rem', 'em', 'vw', 'vh'],
    defaultUnit: 'px',
    step: 1
  },
  'percentage': {
    units: ['%'],
    defaultUnit: '%',
    step: 1
  },
  'time': {
    units: ['ms', 's'],
    defaultUnit: 'ms',
    step: 10
  },
  'angle': {
    units: ['deg', 'rad', 'turn', 'grad'],
    defaultUnit: 'deg',
    step: 1
  }
}

const NUMERIC_PROPERTIES = new Set([
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'top',
  'left',
  'right',
  'bottom',
  'border-width',
  'border-radius',
  'font-size',
  'line-height',
  'gap',
  'z-index',
  'order',
  'flex-grow',
  'flex-shrink'
])

const NON_NEGATIVE_NUMERIC_PROPERTIES = new Set([
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'border-width',
  'border-radius',
  'font-size',
  'gap'
])

const SLIDER_PROPERTIES = new Set([
  'opacity'
])

const rules: MappingRule[] = [
  {
    name: 'keyword-options-select',
    when: (context) => Boolean(context.options && context.options.length > 0),
    map: (context) => ({ controlType: 'select', options: context.options })
  },
  {
    name: 'alpha-slider',
    when: (context) => {
      if (context.families.has('alpha')) {
        return true
      }

      if (!context.families.has('number') && !context.families.has('integer')) {
        return false
      }

      const { min, max } = context.range
      return min === 0 && max === 1
    },
    map: () => ({
      controlType: 'slider',
      min: 0,
      max: 1,
      step: 0.01
    })
  },
  {
    name: 'color-picker',
    when: (context) => context.families.has('color') || context.property.includes('color'),
    map: () => ({ controlType: 'color' })
  },
  {
    name: 'unit-number',
    when: (context) => inferUnitType(context.families) !== null,
    map: (context) => {
      const unitType = inferUnitType(context.families)
      if (!unitType) {
        return { controlType: 'text' }
      }

      const config = UNIT_CONFIGS[unitType]
      return {
        controlType: 'unit-number',
        unitType,
        units: config.units,
        defaultUnit: config.defaultUnit,
        min: context.range.min,
        max: context.range.max,
        step: config.step
      }
    }
  },
  {
    name: 'numeric-input',
    when: (context) => {
      if (NUMERIC_PROPERTIES.has(context.property)) {
        return true
      }

      const hasScalar = context.families.has('number') || context.families.has('integer')
      const hasUnits =
        context.families.has('length') ||
        context.families.has('length-percentage') ||
        context.families.has('percentage') ||
        context.families.has('time') ||
        context.families.has('angle')

      return hasScalar && !hasUnits
    },
    map: (context) => {
      const min =
        context.range.min ??
        (NON_NEGATIVE_NUMERIC_PROPERTIES.has(context.property) ? 0 : undefined)

      const max = context.range.max

      const isSliderPreferred =
        SLIDER_PROPERTIES.has(context.property) &&
        min !== undefined &&
        max !== undefined &&
        Number.isFinite(min) &&
        Number.isFinite(max)

      if (isSliderPreferred) {
        return {
          controlType: 'slider',
          min,
          max,
          step: 0.01
        }
      }

      return {
        controlType: 'number',
        min,
        max,
        step: context.families.has('integer') ? 1 : 0.1
      }
    }
  },
  {
    name: 'fallback-text',
    when: () => true,
    map: () => ({ controlType: 'text' })
  }
]

export function inferControlConfig({ property, syntax, options }: InferControlConfigParams): PropertyControlConfig {
  const context: MappingContext = {
    property,
    syntax,
    options,
    families: inferSyntaxFamilies(syntax),
    range: extractNumericRange(syntax)
  }

  for (const rule of rules) {
    if (rule.when(context)) {
      return rule.map(context)
    }
  }

  return { controlType: 'text' }
}

function inferUnitType(families: Set<SyntaxFamily>): UnitValueType | null {
  if (families.has('length-percentage')) return 'length-percentage'
  if (families.has('length')) return 'length'
  if (families.has('percentage')) return 'percentage'
  if (families.has('time')) return 'time'
  if (families.has('angle')) return 'angle'
  return null
}
