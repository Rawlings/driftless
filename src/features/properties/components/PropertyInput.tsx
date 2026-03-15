import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Slider } from 'primereact/slider'
import type { PropertyInputProps } from './propertyInputUtils'
import { ColorInput } from './ColorInput'
import { SuggestInput } from './SuggestInput'
import { UnitNumberInput } from './UnitNumberInput'

export type { PropertyInputProps }

export function PropertyInput({ property, value, onChange }: PropertyInputProps) {
  switch (property.type) {
    case 'number':
      return (
        <InputNumber
          value={typeof value === 'number' ? value : Number(value ?? property.default)}
          min={property.min}
          max={property.max}
          step={property.step ?? 1}
          useGrouping={false}
          inputClassName="w-full"
          className="mt-1 w-full"
          onValueChange={(e) => onChange(typeof e.value === 'number' ? e.value : property.default)}
        />
      )
    case 'slider':
      return (
        <div className="mt-1 space-y-1">
          <Slider
            value={Number(value ?? property.default)}
            min={property.min ?? 0}
            max={property.max ?? 1}
            step={property.step ?? 0.01}
            className="w-full"
            onChange={(e) => onChange(typeof e.value === 'number' ? e.value : property.default)}
          />
          <div className="text-xs">
            {Number(value ?? property.default).toFixed(2)}
          </div>
        </div>
      )
    case 'unit-number':
      return <UnitNumberInput property={property} value={value} onChange={onChange} />
    case 'color':
      return <ColorInput property={property} value={value} onChange={onChange} />
    case 'select':
      return (
        <Dropdown
          value={value ?? property.default}
          options={property.options ?? []}
          editable
          className="mt-1 w-full"
          onChange={(e) => onChange(e.value)}
        />
      )
    case 'text':
      return property.suggestions?.length ? (
        <SuggestInput value={value ?? ''} suggestions={property.suggestions} onChange={onChange} />
      ) : (
        <InputText
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full"
        />
      )
    default:
      return null
  }
}