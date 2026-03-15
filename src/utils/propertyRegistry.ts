import mdnProperties from 'mdn-data/css/properties.json'
import mdnDefinitions from 'mdn-data/css/definitions.json'
import { inferControlConfig, type PropertyControlType, type UnitValueType } from './propertyControlMapper'
import { getPropertyValueHints } from './propertyValueHints'

export interface PropertyDefinition {
  group: string
  name: string
  type: PropertyControlType
  inherited: boolean
  status: 'standard' | 'experimental' | 'nonstandard' | 'obsolete'
  mdnUrl?: string
  syntax?: string
  typeHints?: Array<{ name: string; mdnUrl?: string; status?: string }>
  options?: string[]
  suggestions?: Array<{ value: string; kind: 'keyword' | 'function'; description?: string; mdnUrl?: string }>
  min?: number
  max?: number
  step?: number
  unitType?: UnitValueType
  units?: string[]
  defaultUnit?: string
  default: any
  cssProperty: string
}

const GROUP_ENUM = new Set<string>(((mdnDefinitions as Record<string, { enum?: string[] }>).groupList?.enum ?? []))

type MdnPropertyRecord = {
  initial?: string | string[]
  syntax?: string | string[]
  groups?: string[]
  inherited?: boolean
  status?: 'standard' | 'experimental' | 'nonstandard' | 'obsolete'
  mdn_url?: string
}

function kebabToCamel(property: string) {
  const [head, ...rest] = property.split('-')
  return [head, ...rest.map((segment) => `${segment[0]?.toUpperCase() ?? ''}${segment.slice(1)}`)].join('')
}

function normalizeMdnGroup(group: string): string {
  const trimmed = group.trim()
  if (GROUP_ENUM.has(trimmed)) {
    return trimmed.replace(/^CSS\s+/i, '').trim()
  }

  const prefixed = trimmed.startsWith('CSS ') ? trimmed : `CSS ${trimmed}`
  if (GROUP_ENUM.has(prefixed)) {
    return prefixed.replace(/^CSS\s+/i, '').trim()
  }

  return trimmed.replace(/^CSS\s+/i, '').trim()
}

function inferGroup(property: string, mdnGroups?: string[]): string {
  if (mdnGroups && mdnGroups.length > 0) {
    const first = normalizeMdnGroup(mdnGroups[0])
    if (first.length > 0) {
      return first
    }
  }

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

function inferDefault(
  initial: string,
  type: PropertyDefinition['type'],
  options?: string[]
): PropertyDefinition['default'] {
  if (type === 'select' && options && options.length > 0) {
    return options[0]
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

function buildPropertyDefinition(property: string): PropertyDefinition {
  const metadata = (mdnProperties as unknown as Record<string, MdnPropertyRecord>)[property] ?? {}
  const syntax = normalizeMetadataValue(metadata.syntax)
  const initial = normalizeMetadataValue(metadata.initial)
  const valueHints = getPropertyValueHints(syntax)
  const control = inferControlConfig({
    property,
    syntax,
    options: valueHints.keywordOnly ? valueHints.keywords : undefined,
    keywordOptions: valueHints.keywords,
    keywordOnly: valueHints.keywordOnly
  })
  const type = control.controlType

  return {
    group: inferGroup(property, metadata.groups),
    name: property,
    type,
    inherited: Boolean(metadata.inherited),
    status: metadata.status ?? 'standard',
    mdnUrl: metadata.mdn_url,
    syntax,
    typeHints: valueHints.typeHints,
    options: control.options,
    suggestions: [
      ...valueHints.keywords.map((value) => ({ value, kind: 'keyword' as const })),
      ...valueHints.functionSuggestions.map((fn) => ({
        value: fn.value,
        kind: 'function' as const,
        description: fn.description,
        mdnUrl: fn.mdnUrl
      }))
    ],
    min: control.min,
    max: control.max,
    step: control.step,
    unitType: control.unitType,
    units: control.units,
    defaultUnit: control.defaultUnit,
    default: inferDefault(initial, type, control.options),
    cssProperty: kebabToCamel(property)
  }
}

export const propertyRegistry: PropertyDefinition[] = Object.keys(mdnProperties)
  .filter((property) => !property.startsWith('-'))
  .map((property) => buildPropertyDefinition(property))
  .sort((a, b) => a.name.localeCompare(b.name))

export const getPropertyRegistry = () => propertyRegistry

export const groupProperties = (registry: PropertyDefinition[]) => {
  const groups: { [key: string]: PropertyDefinition[] } = {}
  registry.forEach(prop => {
    if (!groups[prop.group]) groups[prop.group] = []
    groups[prop.group].push(prop)
  })
  return groups
}