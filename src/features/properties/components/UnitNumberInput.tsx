import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import type { PropertyInputProps } from './propertyInputUtils'
import { parseUnitValue } from './propertyInputUtils'

export function UnitNumberInput({ property, value, onChange }: PropertyInputProps) {
  const defaultUnit = property.defaultUnit ?? 'px'
  const allowedUnits = property.units ?? [defaultUnit]
  const { numeric, unit } = parseUnitValue(value ?? property.default, defaultUnit)
  const activeUnit = allowedUnits.includes(unit) ? unit : defaultUnit
  const suggestions = (property.suggestions ?? [])
    .filter((item) => item.kind === 'keyword')
    .map((item) => item.value)
  const isKeyword = typeof value === 'string' && value.trim() !== '' && !/^-?\d/.test(value.trim())

  return (
    <div className="mt-1 space-y-1.5">
      {isKeyword ? (
        <div className="flex items-center gap-2">
          <span className="rounded px-2 py-1 text-sm">{value}</span>
          <button type="button" onClick={() => onChange(`0${defaultUnit}`)}>
            ×
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <InputNumber
            value={Number.isFinite(numeric) ? numeric : 0}
            min={property.min}
            max={property.max}
            step={property.step ?? 1}
            useGrouping={false}
            inputClassName="w-full"
            className="w-full"
            onValueChange={(e) => {
              const next = typeof e.value === 'number' ? e.value : 0
              onChange(`${next}${activeUnit}`)
            }}
          />
          <Dropdown
            value={activeUnit}
            options={allowedUnits}
            className="w-24"
            onChange={(e) => onChange(`${numeric}${e.value}`)}
          />
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggestions.slice(0, 6).map((kw) => (
            <button
              key={kw}
              type="button"
              className="rounded px-2 py-0.5 text-xs"
              aria-pressed={value === kw}
              onClick={() => onChange(kw)}
            >
              {kw}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
