import type { PropertyDefinition } from '../domain'
import type { Element } from '../../../core/types'
import { PropertyInput } from './PropertyInput'

interface Props {
  props: PropertyDefinition[]
  element: Element
  onUpdateProperty: (cssProperty: string, value: Element['styles'][string]) => void
}

export function PropertyGroup({ props, element, onUpdateProperty }: Props) {
  return (
    <div className="space-y-2">
      {props.map((prop) => (
        <div key={prop.cssProperty}>
          <div className="mb-0.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 mt-2">
              <label className="block text-sm font-normal text-[var(--text-color)]">{prop.cssProperty}</label>
            </div>
          </div>
          <PropertyInput
            property={prop}
            value={element.styles[prop.cssProperty] ?? prop.default}
            onChange={(val) => onUpdateProperty(prop.cssProperty, val)}
          />
        </div>
      ))}
    </div>
  )
}
