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
            <div className="flex items-center gap-1.5">
              <label className="block font-mono text-xs p-text-secondary">{prop.name}</label>
              {prop.inherited ? <span className="text-xs">Inherited</span> : null}
              {prop.status !== 'standard' ? (
                <span className="text-xs capitalize">{prop.status}</span>
              ) : null}
              {prop.typeHints?.slice(0, 2).map((hint) => (
                <span key={hint.name} className="text-xs">{hint.name}</span>
              ))}
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
