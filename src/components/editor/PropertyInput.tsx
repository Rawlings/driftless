import type { PropertyDefinition } from '../../utils/propertyRegistry'

interface PropertyInputProps {
  property: PropertyDefinition
  value: any
  onChange: (value: any) => void
}

export function PropertyInput({ property, value, onChange }: PropertyInputProps) {
  switch (property.type) {
    case 'number':
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full mt-1 border border-gray-300 rounded px-2 py-1"
        />
      )
    case 'color':
      return (
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1"
        />
      )
    case 'select':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1 border border-gray-300 rounded px-2 py-1"
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1 border border-gray-300 rounded px-2 py-1"
        />
      )
    default:
      return null
  }
}