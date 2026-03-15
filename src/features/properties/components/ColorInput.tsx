import { ColorPicker } from 'primereact/colorpicker'
import { InputText } from 'primereact/inputtext'
import type { PropertyInputProps } from './propertyInputUtils'
import { toColorHex } from './propertyInputUtils'

export function ColorInput({ property, value, onChange }: PropertyInputProps) {
  return (
    <div className="mt-1 flex items-center gap-2">
      <ColorPicker
        format="hex"
        value={toColorHex(value, '#000000').replace('#', '')}
        onChange={(e) => onChange(`#${e.value}`)}
        className="shrink-0"
      />
      <InputText
        value={String(value ?? property.default ?? '#000000')}
        className="w-full"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
