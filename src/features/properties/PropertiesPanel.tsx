import { useMemo, useState } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
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
    <aside className="fixed right-4 top-4 bottom-4 z-30 rounded-xl" style={{ width: 340 }}>
      <Panel
        className="flex h-full flex-col rounded-xl border border-slate-300 bg-slate-100"
        pt={{
          header: { className: 'shrink-0 border-b border-slate-300 bg-slate-100' },
          toggleableContent: { className: 'min-h-0 flex-1' },
          content: { className: 'h-full overflow-y-auto bg-slate-100 p-3' }
        }}
        headerTemplate={() => (
          <div className="flex w-full items-center px-3 py-2">
            <span className="font-medium">Properties</span>
          </div>
        )}
      >
        <div className="mb-4 space-y-3">
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties"
            className="w-full"
          />
        </div>

        {!selectedElement ? (
          <p className="text-sm text-slate-500">No element selected</p>
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
      </Panel>
    </aside>
  )
}