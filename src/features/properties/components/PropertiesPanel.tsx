import { useState } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion'
import type { AccordionTabPassThroughOptions } from 'primereact/accordion'
import { usePropertiesCommandDomain, usePropertiesQueryDomain } from '../../state'
import { PanelEmptyState, PanelSearchInput, SideRail } from '../../ui'
import { PropertyGroup } from './PropertyGroup'
import { useGroupedPropertyRegistry } from '../domain'

const propertiesAccordionTabPt: AccordionTabPassThroughOptions = {
  headerAction: { className: 'rounded-none border-x-0 border-b-0 bg-white px-4 py-3' },
  headerTitle: { className: 'text-md font-normal' },
  toggleableContent: { className: 'rounded-none border-x-0border-b-0' },
  content: { className: 'rounded-none border-x-0 border-t-0 border-b-0 bg-white px-4 pb-4 pt-2' }
}

export function PropertiesPanel() {
  const { selectedElement } = usePropertiesQueryDomain()
  const { updateSelectedStyleProperty } = usePropertiesCommandDomain()
  const [search, setSearch] = useState('')
  const [activeSections, setActiveSections] = useState<number[]>([])
  const groupedEntries = useGroupedPropertyRegistry(search)

  return (
    <SideRail side="right" width={420} contentClassName="pt-4 pb-4">
      <div className="mb-4 px-4">
        <PanelSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search properties"
          className="w-full"
        />
      </div>

      {!selectedElement ? (
        <PanelEmptyState className="px-4">No element selected</PanelEmptyState>
      ) : (
        <Accordion
          multiple
          activeIndex={activeSections}
          onTabChange={(e) => setActiveSections(Array.isArray(e.index) ? e.index : e.index === null ? [] : [e.index])}
        >
          {groupedEntries.map(([group, props]) => (
            <AccordionTab
              key={group}
              header={group}
              className="m-0 rounded-none border-x-0 border-t-0 border-b-0"
              headerClassName="m-0"
              pt={propertiesAccordionTabPt}
            >
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