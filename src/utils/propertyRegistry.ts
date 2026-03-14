import mdnProperties from 'mdn-data/css/properties.json'
import { inferControlConfig, type PropertyControlType, type UnitValueType } from './propertyControlMapper'

export interface PropertyDefinition {
  group: string
  name: string
  type: PropertyControlType
  options?: string[]
  min?: number
  max?: number
  step?: number
  unitType?: UnitValueType
  units?: string[]
  defaultUnit?: string
  default: any
  cssProperty: string
  tier: 'common' | 'advanced'
}

type MdnPropertyRecord = {
  initial?: string | string[]
  syntax?: string | string[]
}

const COMMON_PROPERTY_KEYS = [
  'position',
  'display',
  'width',
  'height',
  'left',
  'top',
  'z-index',
  'color',
  'font-size',
  'font-weight',
  'text-align',
  'padding',
  'margin',
  'gap',
  'background-color',
  'background-image',
  'border-width',
  'border-style',
  'border-color',
  'border-radius',
  'opacity',
  'box-shadow',
  'transition',
  'transform'
] as const

const SELECT_OPTIONS: Record<string, string[]> = {
  position: ['absolute', 'relative', 'fixed', 'sticky', 'static'],
  display: ['block', 'inline-block', 'inline', 'flex', 'grid', 'none'],
  'font-weight': ['300', '400', '500', '600', '700', '800'],
  'text-align': ['left', 'center', 'right', 'justify'],
  'border-style': ['solid', 'dashed', 'dotted', 'none']
}

function kebabToCamel(property: string) {
  const [head, ...rest] = property.split('-')
  return [head, ...rest.map((segment) => `${segment[0]?.toUpperCase() ?? ''}${segment.slice(1)}`)].join('')
}

function kebabToLabel(property: string) {
  return property
    .split('-')
    .map((segment) => `${segment[0]?.toUpperCase() ?? ''}${segment.slice(1)}`)
    .join(' ')
}

function inferGroup(property: string): string {
  if (/^grid-/.test(property)) return 'Grid'
  if (/^flex|^align-|^justify-/.test(property)) return 'Flexbox'
  if (/^(font-|line-|letter-|text-|color$)/.test(property)) return 'Typography'
  if (/^background-/.test(property)) return 'Background'
  if (/^(border-|outline)/.test(property)) return 'Borders'
  if (/^(padding|margin|inset|top$|right$|bottom$|left$|gap$)/.test(property)) return 'Spacing'
  if (/^(width|height|min-|max-|display$|position$|overflow|z-index$)/.test(property)) return 'Layout'
  if (/^(transform|transition|animation)/.test(property)) return 'Motion'
  if (/^(opacity|box-shadow|filter|backdrop-filter|mix-blend-mode)/.test(property)) return 'Effects'
  return 'Advanced'
}

function normalizeMetadataValue(value: string | string[] | undefined): string {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }
  return ''
}

function inferDefault(property: string, initial: string, type: PropertyDefinition['type']): PropertyDefinition['default'] {
  if (SELECT_OPTIONS[property]) {
    return SELECT_OPTIONS[property][0]
  }

  if (type === 'number' || type === 'slider') {
    const parsed = Number(initial)
    return Number.isNaN(parsed) ? 0 : parsed
  }

  if (type === 'unit-number') {
    const normalized = initial.trim()
    if (normalized.length > 0) {
      return normalized
    }
    return '0px'
  }

  if (type === 'color') {
    return initial === 'transparent' ? '#000000' : initial || '#000000'
  }

  return initial || 'initial'
}

function buildPropertyDefinition(property: string, tier: PropertyDefinition['tier']): PropertyDefinition {
  const metadata = (mdnProperties as unknown as Record<string, MdnPropertyRecord>)[property] ?? {}
  const syntax = normalizeMetadataValue(metadata.syntax)
  const initial = normalizeMetadataValue(metadata.initial)
  const control = inferControlConfig({
    property,
    syntax,
    options: SELECT_OPTIONS[property]
  })
  const type = control.controlType

  return {
    group: inferGroup(property),
    name: kebabToLabel(property),
    type,
    options: control.options,
    min: control.min,
    max: control.max,
    step: control.step,
    unitType: control.unitType,
    units: control.units,
    defaultUnit: control.defaultUnit,
    default: inferDefault(property, initial, type),
    cssProperty: kebabToCamel(property),
    tier
  }
}

const COMMON_PROPERTIES: PropertyDefinition[] = COMMON_PROPERTY_KEYS.map((property) => buildPropertyDefinition(property, 'common'))

const ADVANCED_PROPERTIES: PropertyDefinition[] = Object.keys(mdnProperties)
  .filter((property) => !property.startsWith('-'))
  .filter((property) => !COMMON_PROPERTY_KEYS.includes(property as (typeof COMMON_PROPERTY_KEYS)[number]))
  .map((property) => buildPropertyDefinition(property, 'advanced'))
  .sort((a, b) => a.name.localeCompare(b.name))

export const propertyRegistry: PropertyDefinition[] = [...COMMON_PROPERTIES, ...ADVANCED_PROPERTIES]

export const getPropertyRegistry = (mode: 'common' | 'all' = 'common') => {
  if (mode === 'all') {
    return propertyRegistry
  }
  return propertyRegistry.filter((property) => property.tier === 'common')
}

export const groupProperties = (registry: PropertyDefinition[]) => {
  const groups: { [key: string]: PropertyDefinition[] } = {}
  registry.forEach(prop => {
    if (!groups[prop.group]) groups[prop.group] = []
    groups[prop.group].push(prop)
  })
  return groups
}