import { Button } from 'primereact/button'
import type { TreeNode } from 'primereact/treenode'
import type { Element } from '../../core/types'
import { LAYER_ICON, LAYER_ACTIONS } from './layerUtils'

interface Props {
  node: TreeNode
  selectedId: string | null | undefined
  onMove: (id: string, dir: 'up' | 'down') => void
}

export function LayerNode({ node, selectedId, onMove }: Props) {
  const { element, label } = node.data as { element: Element; label: string }
  const isSelected = element.id === selectedId

  return (
    <div className="flex w-full items-center gap-2">
      <span className="inline-flex h-5 w-5 items-center justify-center text-slate-700">
        <i className={`${LAYER_ICON[element.type] ?? 'pi pi-pencil'} text-xs`} aria-hidden="true" />
      </span>
      <span className={`truncate text-sm ${isSelected ? 'font-semibold text-slate-900' : 'text-slate-800'}`}>
        {label}
      </span>
      {element.locked && <i className="pi pi-lock text-xs text-slate-500" aria-hidden="true" />}
      {element.hidden && <i className="pi pi-eye-slash text-xs text-slate-500" aria-hidden="true" />}
      <div className="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {LAYER_ACTIONS.map(({ dir, tooltip }) => (
          <Button
            key={dir}
            type="button"
            text
            className="h-6 w-6 p-0 text-slate-600"
            tooltip={tooltip}
            tooltipOptions={{ position: 'top', showDelay: 120 }}
            onClick={(e) => { e.stopPropagation(); onMove(element.id, dir) }}
          >
            <i className={`pi pi-angle-${dir} text-xs`} aria-hidden="true" />
          </Button>
        ))}
      </div>
    </div>
  )
}
