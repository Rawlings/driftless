import mdnDefinitions from 'mdn-data/css/definitions.json'
import mdnProperties from 'mdn-data/css/properties.json'
import { inferControlConfig, type PropertyControlConfig } from './propertyControlMapper'
import { getPropertyValueHints, type PropertyValueHints } from './propertyValueHints'

export interface PropertyMetadata {
  property: string
  initial: string
  syntax: string
  groups: string[]
  inherited: boolean
  status: 'standard' | 'experimental' | 'nonstandard' | 'obsolete'
  mdnUrl?: string
}

export interface PropertyMetadataProvider {
  getKnownGroups: () => Set<string>
  listProperties: () => string[]
  getPropertyMetadata: (property: string) => PropertyMetadata
}

export interface PropertyControlMapper {
  inferControl: (params: {
    property: string
    syntax: string
    options?: string[]
    keywordOptions?: string[]
    keywordOnly?: boolean
  }) => PropertyControlConfig
}

export interface PropertyHintProvider {
  getHints: (syntax: string) => PropertyValueHints
}

export interface PropertyPipeline {
  metadataProvider: PropertyMetadataProvider
  controlMapper: PropertyControlMapper
  hintProvider: PropertyHintProvider
}

let defaultPropertyPipeline: PropertyPipeline | undefined

type MdnPropertyRecord = {
  initial?: string | string[]
  syntax?: string | string[]
  groups?: string[]
  inherited?: boolean
  status?: 'standard' | 'experimental' | 'nonstandard' | 'obsolete'
  mdn_url?: string
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

export function createDefaultPropertyMetadataProvider(): PropertyMetadataProvider {
  const records = mdnProperties as unknown as Record<string, MdnPropertyRecord>
  const knownGroups = new Set<string>(((mdnDefinitions as Record<string, { enum?: string[] }>).groupList?.enum ?? []))

  return {
    getKnownGroups: () => knownGroups,
    listProperties: () => Object.keys(records).filter((property) => !property.startsWith('-')),
    getPropertyMetadata: (property) => {
      const metadata = records[property] ?? {}

      return {
        property,
        initial: normalizeMetadataValue(metadata.initial),
        syntax: normalizeMetadataValue(metadata.syntax),
        groups: metadata.groups ?? [],
        inherited: Boolean(metadata.inherited),
        status: metadata.status ?? 'standard',
        mdnUrl: metadata.mdn_url,
      }
    },
  }
}

export function createDefaultPropertyControlMapper(): PropertyControlMapper {
  return {
    inferControl: (params) => inferControlConfig(params),
  }
}

export function createDefaultPropertyHintProvider(): PropertyHintProvider {
  return {
    getHints: (syntax) => getPropertyValueHints(syntax),
  }
}

export function createDefaultPropertyPipeline(): PropertyPipeline {
  return {
    metadataProvider: createDefaultPropertyMetadataProvider(),
    controlMapper: createDefaultPropertyControlMapper(),
    hintProvider: createDefaultPropertyHintProvider(),
  }
}

export function getDefaultPropertyPipeline(): PropertyPipeline {
  if (!defaultPropertyPipeline) {
    defaultPropertyPipeline = createDefaultPropertyPipeline()
  }

  return defaultPropertyPipeline
}