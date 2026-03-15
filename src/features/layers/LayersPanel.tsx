import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Tree } from 'primereact/tree'
import { useEditorCommands, useEditorData } from '../state/EditorContext'
import { findLocation, treePt } from './layerUtils'
import { useLayerTree } from './useLayerTree'
import { LayerNode } from './LayerNode'

export function LayersPanel() {
  const { elements, selectedId } = useEditorData()
  const { selectElement, moveElementLayer, setElementParentAt } = useEditorCommands()
  const [search, setSearch] = useState('')
  const { filteredNodes, expandedKeys, setExpandedKeys } = useLayerTree(elements, search)

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-30" style={{ width: 340 }}>
      <div className="flex h-full flex-col rounded-none border-0 bg-[var(--surface-card)] shadow-xl">
        <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--surface-card)] px-4 pt-4 pb-4">
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search layers"
            className="mb-4 w-full"
          />

          <Tree
            value={filteredNodes}
            className="border-none"
            pt={treePt}
            selectionMode="single"
            selectionKeys={selectedId}
            metaKeySelection={false}
            onSelectionChange={(e) => selectElement(typeof e.value === 'string' ? e.value : null)}
            nodeTemplate={(node) => (
              <LayerNode node={node} selectedId={selectedId} onMove={moveElementLayer} />
            )}
            emptyMessage="No layers"
            dragdropScope={search.trim() ? undefined : 'rui-layers'}
            expandedKeys={expandedKeys}
            onToggle={(e) => setExpandedKeys(e.value)}
            onDragDrop={(event) => {
              const dragId = event.dragNode.key == null ? null : String(event.dragNode.key)
              if (!dragId) return
              const loc = findLocation(event.value, dragId)
              if (loc) setElementParentAt(dragId, loc.parentId, loc.indexTopFirst)
            }}
          />
        </div>
      </div>
    </aside>
  )
}
