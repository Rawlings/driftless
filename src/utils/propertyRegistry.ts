export interface PropertyDefinition {
  group: string
  name: string
  type: 'number' | 'color' | 'select' | 'text'
  options?: string[]
  default: any
  cssProperty: string
}

export const propertyRegistry: PropertyDefinition[] = [
  // Layout
  { group: 'Layout', name: 'Width', type: 'number', default: 100, cssProperty: 'width' },
  { group: 'Layout', name: 'Height', type: 'number', default: 100, cssProperty: 'height' },
  { group: 'Layout', name: 'X Position', type: 'number', default: 100, cssProperty: 'x' },
  { group: 'Layout', name: 'Y Position', type: 'number', default: 100, cssProperty: 'y' },

  // Borders
  { group: 'Borders', name: 'Border Width', type: 'number', default: 1, cssProperty: 'borderWidth' },
  { group: 'Borders', name: 'Border Style', type: 'select', options: ['solid', 'dashed', 'dotted', 'none'], default: 'solid', cssProperty: 'borderStyle' },
  { group: 'Borders', name: 'Border Color', type: 'color', default: '#000000', cssProperty: 'borderColor' },
  { group: 'Borders', name: 'Border Radius', type: 'number', default: 0, cssProperty: 'borderRadius' },

  // Background
  { group: 'Background', name: 'Background Color', type: 'color', default: '#000000', cssProperty: 'backgroundColor' },

  // Effects
  { group: 'Effects', name: 'Box Shadow', type: 'text', default: 'none', cssProperty: 'boxShadow' },
]

export const groupProperties = (registry: PropertyDefinition[]) => {
  const groups: { [key: string]: PropertyDefinition[] } = {}
  registry.forEach(prop => {
    if (!groups[prop.group]) groups[prop.group] = []
    groups[prop.group].push(prop)
  })
  return groups
}