import { extractNumericRange, inferSyntaxFamilies, type SyntaxFamily } from './propertySyntaxClassifier'
import mdnUnits from 'mdn-data/css/units.json'

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
  keywordOptions?: string[]
  keywordOnly?: boolean
}

interface MappingContext {
  property: string
  syntax: string
  families: Set<SyntaxFamily>
  options?: string[]
  keywordOptions: string[]
  keywordOnly: boolean
  range: { min?: number; max?: number }
}

interface MappingRule {
  name: string
  when: (context: MappingContext) => boolean
  map: (context: MappingContext) => PropertyControlConfig
}

const MDN_UNIT_SET = new Set<string>(Object.keys(mdnUnits as Record<string, unknown>))

function pickKnownUnits(units: string[]): string[] {
  return units.filter((unit) => unit === '%' || MDN_UNIT_SET.has(unit))
}

const UNIT_CONFIGS: Record<UnitValueType, { units: string[]; defaultUnit: string; step: number }> = {
  'length': {
    units: pickKnownUnits(['px', 'rem', 'em', 'vw', 'vh', 'vmin', 'vmax', 'vi', 'vb', 'svw', 'svh', 'lvw', 'lvh', 'dvw', 'dvh', 'ch', 'ex', 'cm', 'mm', 'in', 'pt', 'pc', 'q', 'lh', 'rlh', 'cap', 'ic']),
    defaultUnit: 'px',
    step: 1
  },
  'length-percentage': {
    units: pickKnownUnits(['px', '%', 'rem', 'em', 'vw', 'vh', 'vmin', 'vmax', 'vi', 'vb', 'svw', 'svh', 'lvw', 'lvh', 'dvw', 'dvh', 'ch', 'ex', 'cm', 'mm', 'in', 'pt', 'pc', 'q', 'lh', 'rlh', 'cap', 'ic']),
    defaultUnit: 'px',
    step: 1
  },
  'percentage': {
    units: ['%'],
    defaultUnit: '%',
    step: 1
  },
  'time': {
    units: pickKnownUnits(['ms', 's']),
    defaultUnit: 'ms',
    step: 10
  },
  'angle': {
    units: pickKnownUnits(['deg', 'rad', 'turn', 'grad']),
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
    name: 'finite-keyword-select',
    when: (context) => Boolean(context.options && context.options.length >= 2 && context.options.length <= 20),
    map: (context) => ({ controlType: 'select', options: context.options })
  },
  {
    name: 'keyword-only-select-from-hints',
    when: (context) => context.keywordOnly && context.keywordOptions.length >= 2 && context.keywordOptions.length <= 20,
    map: (context) => ({ controlType: 'select', options: context.keywordOptions })
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

export function inferControlConfig({
  property,
  syntax,
  options,
  keywordOptions,
  keywordOnly
}: InferControlConfigParams): PropertyControlConfig {
  const context: MappingContext = {
    property,
    syntax,
    options,
    keywordOptions: keywordOptions ?? [],
    keywordOnly: keywordOnly ?? false,
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
