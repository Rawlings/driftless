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
