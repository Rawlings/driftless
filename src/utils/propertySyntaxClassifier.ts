export type SyntaxFamily =
  | 'alpha'
  | 'color'
  | 'number'
  | 'integer'
  | 'percentage'
  | 'length'
  | 'length-percentage'
  | 'time'
  | 'angle'
  | 'url'
  | 'image'
  | 'position'
  | 'identifier'
  | 'keyword-reference'
  | 'complex'

const FAMILY_PATTERNS: Array<[SyntaxFamily, RegExp]> = [
  ['alpha', /<alpha-value>|<opacity-value>/],
  ['color', /<color>/],
  ['number', /<number(?:\s*\[[^\]]+\])?>/],
  ['integer', /<integer(?:\s*\[[^\]]+\])?>/],
  ['percentage', /<percentage(?:\s*\[[^\]]+\])?>/],
  ['length-percentage', /<length-percentage(?:\s*\[[^\]]+\])?>/],
  ['length', /<length(?:\s*\[[^\]]+\])?>/],
  ['time', /<time(?:\s*\[[^\]]+\])?>/],
  ['angle', /<angle(?:\s*\[[^\]]+\])?>/],
  ['url', /<url>/],
  ['image', /<image>/],
  ['position', /<position>/],
  ['identifier', /<custom-ident>|<dashed-ident>/],
  ['keyword-reference', /<'.+?'>/],
  ['complex', /\(|\|\||&&|\[|\]/]
]

export function inferSyntaxFamilies(syntax: string): Set<SyntaxFamily> {
  const source = syntax.toLowerCase()
  const families = new Set<SyntaxFamily>()

  for (const [family, pattern] of FAMILY_PATTERNS) {
    if (pattern.test(source)) {
      families.add(family)
    }
  }

  return families
}

function parseRangeBound(bound: string): number | undefined {
  const normalized = bound.trim().toLowerCase()
  if (normalized === '-infinity' || normalized === '-∞') {
    return Number.NEGATIVE_INFINITY
  }
  if (normalized === 'infinity' || normalized === '∞') {
    return Number.POSITIVE_INFINITY
  }
  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? undefined : parsed
}

const CSS_GLOBAL_KEYWORDS = new Set(['inherit', 'initial', 'unset', 'revert', 'revert-layer'])

/**
 * Extracts bare CSS keyword values from an MDN syntax string.
 * Strips data types (<length>), property references (<'prop'>), function calls,
 * multipliers, and special characters, then returns the remaining lowercase identifiers.
 */
export function extractKeywords(syntax: string): string[] {
  if (!syntax) return []
  let s = syntax
  // Strip property references like <'border-style'>
  s = s.replace(/<'[^']*'>/g, ' ')
  // Strip data type tokens like <length>, <color>, <length-percentage [0,∞]>
  s = s.replace(/<[^>]*>/g, ' ')
  // Strip function calls like fit-content(...), calc(...)
  s = s.replace(/[a-z0-9-]+\([^)]*\)/gi, ' ')
  // Strip remaining punctuation and multipliers
  s = s.replace(/[\[\]{}|?*+#!,]/g, ' ')
  // Extract bare lowercase identifiers (2+ chars)
  const tokens = s.match(/\b[a-z][a-z0-9-]+\b/g) ?? []
  const seen = new Set<string>()
  const result: string[] = []
  for (const t of tokens) {
    if (!seen.has(t) && !CSS_GLOBAL_KEYWORDS.has(t)) {
      seen.add(t)
      result.push(t)
    }
  }
  return result.slice(0, 30)
}

export function extractNumericRange(syntax: string): { min?: number; max?: number } {
  const source = syntax.toLowerCase()
  const match = source.match(/<[^>]*\[\s*([^,\]]+)\s*,\s*([^\]]+)\s*\][^>]*>/)
  if (!match) {
    return {}
  }

  const min = parseRangeBound(match[1])
  const max = parseRangeBound(match[2])

  return { min, max }
}
