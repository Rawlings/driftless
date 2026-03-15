import { useMemo, useState } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { InputText } from 'primereact/inputtext'
import type { PropertyDefinition } from '../../utils/propertyRegistry'
import { getPropertyRegistry, groupProperties } from '../../utils/propertyRegistry'
import { useEditorCommands, useEditorData } from '../state/EditorContext'
import { PropertyGroup } from './PropertyGroup'

export function PropertiesPanel() {
  const { selectedElement } = useEditorData()
  const { updateElement } = useEditorCommands()
  const [search, setSearch] = useState('')
  const [activeSections, setActiveSections] = useState<number[]>([0])

  const groupedEntries = useMemo(() => {
    const base = getPropertyRegistry()
    const query = search.trim().toLowerCase()
    const filtered = query
      ? base.filter((p) =>
          p.name.toLowerCase().includes(query) ||
          p.cssProperty.toLowerCase().includes(query) ||
          p.group.toLowerCase().includes(query)
        )
      : base
    return Object.entries(groupProperties(filtered)) as Array<[string, PropertyDefinition[]]>
  }, [search])

  return (
    <aside className="fixed right-0 top-0 bottom-0 z-30" style={{ width: 360 }}>
      <div className="flex h-full flex-col rounded-none border-0 bg-[var(--surface-card)] shadow-xl">
        <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--surface-card)] px-4 pt-4 pb-4">
          <div className="mb-4">
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties"
              className="w-full"
            />
          </div>

          {!selectedElement ? (
            <p className="text-sm text-[var(--text-color-secondary)]">No element selected</p>
          ) : (
            <Accordion
              multiple
              activeIndex={activeSections}
              onTabChange={(e) => setActiveSections(Array.isArray(e.index) ? e.index : e.index === null ? [] : [e.index])}
            >
              {groupedEntries.map(([group, props]) => (
                <AccordionTab key={group} header={group}>
                  <PropertyGroup
                    props={props}
                    element={selectedElement}
                    onUpdate={(styles) => updateElement(selectedElement.id, { styles })}
                  />
                </AccordionTab>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </aside>
  )
}