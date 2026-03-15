export function parseUnitValue(rawValue: unknown, defaultUnit: string) {
  if (typeof rawValue === 'number') {
    return { numeric: rawValue, unit: defaultUnit }
  }
  if (typeof rawValue !== 'string') {
    return { numeric: 0, unit: defaultUnit }
  }
  const trimmed = rawValue.trim()
  if (trimmed.length === 0) {
    return { numeric: 0, unit: defaultUnit }
  }
  const match = trimmed.match(/^(-?\d*\.?\d+)([a-z%]*)$/i)
  if (!match) {
    return { numeric: 0, unit: defaultUnit }
  }
  const numeric = Number(match[1])
  return {
    numeric: Number.isNaN(numeric) ? 0 : numeric,
    unit: match[2] || defaultUnit
  }
}

export function toColorHex(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : fallback
}

export interface PropertyInputProps {
  property: import('../../utils/propertyRegistry').PropertyDefinition
  value: any
  onChange: (value: any) => void
}
