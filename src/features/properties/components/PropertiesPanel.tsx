import { useState } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { usePropertiesCommandDomain, usePropertiesQueryDomain } from '../../state'
import { PanelEmptyState, PanelSearchInput, SideRail } from '../../ui'
import { PropertyGroup } from './PropertyGroup'
import { useGroupedPropertyRegistry } from '../domain'

export function PropertiesPanel() {
  const { selectedElement } = usePropertiesQueryDomain()
  const { updateSelectedStyleProperty } = usePropertiesCommandDomain()
  const [search, setSearch] = useState('')
  const [activeSections, setActiveSections] = useState<number[]>([0])
  const groupedEntries = useGroupedPropertyRegistry(search)

  return (
    <SideRail side="right" width={360}>
      <div className="mb-4">
        <PanelSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search properties"
          className="w-full"
        />
      </div>

      {!selectedElement ? (
        <PanelEmptyState>No element selected</PanelEmptyState>
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
                onUpdateProperty={updateSelectedStyleProperty}
              />
            </AccordionTab>
          ))}
        </Accordion>
      )}
    </SideRail>
  )
}