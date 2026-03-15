import type { PropertyDefinition } from '../../utils/propertyRegistry'
import { cn, uiTokens } from '../ui/tokens'

interface PropertyInputProps {
  property: PropertyDefinition
  value: any
  onChange: (value: any) => void
}

function parseUnitValue(rawValue: unknown, defaultUnit: string) {
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
  const parsedUnit = match[2] || defaultUnit
  return {
    numeric: Number.isNaN(numeric) ? 0 : numeric,
    unit: parsedUnit
  }
}

function toColorInputValue(value: unknown, fallback: string) {
  if (typeof value !== 'string') {
    return fallback
  }

  const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
  return isHex ? value : fallback
}

export function PropertyInput({ property, value, onChange }: PropertyInputProps) {
  const inputBaseClass = cn('mt-1', uiTokens.input.base, uiTokens.motion.control, uiTokens.input.hover, uiTokens.focus.ringSoft)
  const selectBaseClass = cn(inputBaseClass, uiTokens.input.select)

  switch (property.type) {
    case 'number':
      return (
        <input
          type="number"
          value={value ?? ''}
          min={property.min}
          max={property.max}
          step={property.step ?? 1}
          onChange={(e) => {
            const next = e.target.value
            if (next.trim() === '') {
              onChange(property.default)
              return
            }
            const parsed = Number(next)
            onChange(Number.isNaN(parsed) ? property.default : parsed)
          }}
          className={inputBaseClass}
        />
      )
    case 'slider':
      return (
        <div className="mt-1 space-y-1">
          <input
            type="range"
            value={Number(value ?? property.default)}
            min={property.min ?? 0}
            max={property.max ?? 1}
            step={property.step ?? 0.01}
            onChange={(e) => {
              const parsed = Number(e.target.value)
              onChange(Number.isNaN(parsed) ? property.default : parsed)
            }}
            className="w-full cursor-pointer accent-blue-600 outline-none"
          />
          <div className="text-xs text-slate-500">{Number(value ?? property.default).toFixed(2)}</div>
        </div>
      )
    case 'unit-number': {
      const defaultUnit = property.defaultUnit ?? 'px'
      const allowedUnits = property.units ?? [defaultUnit]
      const { numeric, unit } = parseUnitValue(value ?? property.default, defaultUnit)
      const activeUnit = allowedUnits.includes(unit) ? unit : defaultUnit

      return (
        <div className="mt-1 flex items-center gap-2">
          <input
            type="number"
            value={Number.isFinite(numeric) ? numeric : 0}
            min={property.min}
            max={property.max}
            step={property.step ?? 1}
            onChange={(e) => {
              const parsed = Number(e.target.value)
              const nextNumeric = Number.isNaN(parsed) ? 0 : parsed
              onChange(`${nextNumeric}${activeUnit}`)
            }}
            className={cn('w-full', uiTokens.input.base, uiTokens.motion.control, uiTokens.input.hover, uiTokens.focus.ringSoft)}
          />
          <select
            value={activeUnit}
            onChange={(e) => onChange(`${numeric}${e.target.value}`)}
            className={cn('w-24 px-2', uiTokens.input.base, uiTokens.motion.control, uiTokens.input.hover, uiTokens.input.select, uiTokens.focus.ringSoft)}
          >
            {allowedUnits.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      )
    }
    case 'color':
      return (
        <input
          type="color"
          value={toColorInputValue(value, '#000000')}
          onChange={(e) => onChange(e.target.value)}
          className={cn('mt-1 w-full', uiTokens.input.base, uiTokens.motion.control, uiTokens.input.hover, uiTokens.input.color, uiTokens.focus.ringSoft)}
        />
      )
    case 'select':
      return (
        <select
          value={value ?? property.default}
          onChange={(e) => onChange(e.target.value)}
          className={selectBaseClass}
        >
          {property.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    case 'text':
      return (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputBaseClass}
        />
      )
    default:
      return null
  }
}