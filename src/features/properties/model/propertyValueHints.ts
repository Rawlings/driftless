import mdnSyntaxes from 'mdn-data/css/syntaxes.json'
import mdnTypes from 'mdn-data/css/types.json'
import mdnFunctions from 'mdn-data/css/functions.json'
import { extractKeywords, inferSyntaxFamilies } from './propertySyntaxClassifier'

type MdnSyntaxRecord = {
  syntax?: string
}

const TYPED_FAMILY_MARKERS = new Set([
  'color',
  'number',
  'integer',
  'percentage',
  'length',
  'length-percentage',
  'time',
  'angle',
  'url',
  'image',
  'position',
  'identifier',
])

export interface PropertyValueHints {
  keywords: string[]
  keywordOnly: boolean
  typeHints: Array<{ name: string; mdnUrl?: string; status?: string }>
  functionSuggestions: Array<{ value: string; description?: string; mdnUrl?: string }>
}

function getSyntaxByName(name: string): string | null {
  const record = (mdnSyntaxes as unknown as Record<string, MdnSyntaxRecord>)[name]
  return record?.syntax ?? null
}

function getReferencedSyntaxNames(syntax: string): string[] {
  return extractReferencedSyntaxNames(syntax)
}

function extractReferencedSyntaxNames(syntax: string): string[] {
  const refs = new Set<string>()
  const matches = syntax.match(/<([^>]+)>/g) ?? []

  for (const match of matches) {
    const inside = match.slice(1, -1).trim()
    if (!inside || inside.startsWith("'")) {
      continue
    }

    const name = inside.split(/[\s\[]/, 1)[0]
    if (/^[a-z][a-z0-9-]*$/i.test(name)) {
      refs.add(name.toLowerCase())
    }
  }

  return [...refs]
}

function expandSyntaxReferences(rootSyntax: string, maxDepth = 4): string[] {
  const queue: Array<{ syntax: string; depth: number }> = [{ syntax: rootSyntax, depth: 0 }]
  const visited = new Set<string>()
  const expanded: string[] = []

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) continue

    const refs = extractReferencedSyntaxNames(current.syntax)
    for (const ref of refs) {
      if (visited.has(ref)) continue
      visited.add(ref)

      const resolved = getSyntaxByName(ref)
      if (!resolved) continue

      expanded.push(resolved)
      if (current.depth < maxDepth) {
        queue.push({ syntax: resolved, depth: current.depth + 1 })
      }
    }
  }

  return expanded
}

export function getPropertyValueHints(syntax: string): PropertyValueHints {
  if (!syntax) {
    return { keywords: [], keywordOnly: false, typeHints: [], functionSuggestions: [] }
  }

  const expanded = expandSyntaxReferences(syntax)
  const merged = [syntax, ...expanded].join(' | ')
  const keywords = extractKeywords(merged)

  const families = inferSyntaxFamilies(merged)
  const hasTypedMarkers = [...families].some((family) => TYPED_FAMILY_MARKERS.has(family))

  const allRefs = new Set<string>()
  for (const chunk of [syntax, ...expanded]) {
    getReferencedSyntaxNames(chunk).forEach((ref) => allRefs.add(ref))
  }

  const typeHints = [...allRefs]
    .filter((name) => Boolean((mdnTypes as Record<string, { mdn_url?: string; status?: string }>)[name]))
    .map((name) => {
      const record = (mdnTypes as Record<string, { mdn_url?: string; status?: string }>)[name]
      return {
        name,
        mdnUrl: record?.mdn_url,
        status: record?.status
      }
    })

  const fnNames = [...new Set((merged.match(/[a-z-]+\(/gi) ?? []).map((token) => token.slice(0, -1).toLowerCase()))]
  const functionSuggestions = fnNames
    .map((name) => {
      const key = `${name}()`
      const record = (mdnFunctions as Record<string, { syntax?: string; mdn_url?: string }>)[key]
      return {
        value: `${name}()`,
        description: record?.syntax,
        mdnUrl: record?.mdn_url
      }
    })
    .filter((item) => Boolean(item.description || item.mdnUrl))
    .slice(0, 24)

  return {
    keywords,
    keywordOnly: !hasTypedMarkers && keywords.length > 0,
    typeHints,
    functionSuggestions
  }
}
