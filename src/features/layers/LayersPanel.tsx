import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
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
    <aside className="fixed left-4 top-4 bottom-4 z-30 rounded-xl" style={{ width: 320 }}>
      <Panel
        className="flex h-full flex-col rounded-xl border border-slate-300 bg-slate-100"
        pt={{
          header: { className: 'shrink-0 border-b border-slate-300 bg-slate-100' },
          toggleableContent: { className: 'min-h-0 flex-1' },
          content: { className: 'h-full overflow-y-auto bg-slate-100 p-3' }
        }}
        headerTemplate={() => (
          <div className="flex w-full items-center px-3 py-2">
            <span className="font-medium">Layers</span>
          </div>
        )}
      >
        <InputText
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search layers"
          className="mb-3 w-full"
        />

        <div className="rounded-lg bg-slate-100">
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
      </Panel>
    </aside>
  )
}
