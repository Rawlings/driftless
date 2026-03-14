import type { Element } from './types'
import { propertyRegistry, groupProperties } from '../../utils/propertyRegistry'
import { PropertyInput } from './PropertyInput'

interface PropertiesPanelProps {
  selectedElement: Element | null
  onUpdateElement: (id: string, updates: Partial<Element>) => void
}

export function PropertiesPanel({ selectedElement, onUpdateElement }: PropertiesPanelProps) {
  const grouped = groupProperties(propertyRegistry)

  if (!selectedElement) {
    return (
      <div className="w-80 p-4 border-l border-gray-300 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Properties</h3>
        <p className="text-gray-500">No element selected</p>
      </div>
    )
  }

  return (
    <div className="w-80 p-4 border-l border-gray-300 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">Properties</h3>
      <div className="space-y-4">
        {Object.entries(grouped).map(([group, props]) => (
          <details key={group} className="border border-gray-200 rounded">
            <summary className="cursor-pointer p-2 bg-gray-100 font-medium">{group}</summary>
            <div className="p-2 space-y-2">
              {props.map(prop => (
                <div key={prop.name}>
                  <label className="block text-sm font-medium">{prop.name}</label>
                  <PropertyInput
                    property={prop}
                    value={selectedElement.styles[prop.cssProperty]}
                    onChange={(val) => onUpdateElement(selectedElement.id, {
                      styles: { ...selectedElement.styles, [prop.cssProperty]: val }
                    })}
                  />
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}