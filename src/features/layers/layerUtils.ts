import type { TreePassThroughOptions } from 'primereact/tree'
import type { TreeNode } from 'primereact/treenode'
import type { Element } from '../../core/types'

export const LAYER_ICON: Record<string, string> = {
  square: 'pi pi-stop',
  circle: 'pi pi-circle',
  line: 'pi pi-minus',
}

const TYPE_NAME: Record<string, string> = {
  square: 'Rectangle',
  circle: 'Ellipse',
  line: 'Line',
}

export function getLayerLabel(element: Element, index: number): string {
  if (element.type === 'text') {
    return String(element.styles.text ?? '').trim() || `Text ${index + 1}`
  }
  return `${TYPE_NAME[element.type] ?? element.type} ${index + 1}`
}

export const treePt: TreePassThroughOptions = {
  root: { className: 'border-none bg-transparent p-0' },
  container: { className: 'divide-y divide-[var(--surface-border)]' },
  subgroup: { className: 'pl-3' },
  toggler: {
    className: 'mr-1 inline-flex h-5 w-5 items-center justify-center rounded-md text-[var(--text-color-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-color)]'
  },
  content: (options) => ({
    className: `group flex items-center gap-2 px-2.5 py-2 transition-colors ${
      options?.context?.selected
        ? 'bg-[var(--primary-color)] text-[var(--primary-color-text)]'
        : 'hover:bg-[var(--surface-hover)]'
    }`
  })
}

export const LAYER_ACTIONS = [
  { dir: 'down', tooltip: 'Send backward' },
  { dir: 'up', tooltip: 'Bring forward' },
] as const

export function findLocation(
  nodes: TreeNode[],
  targetKey: string,
  parentId: string | null = null
): { parentId: string | null; indexTopFirst: number } | null {
  for (let i = 0; i < nodes.length; i++) {
    const key = String(nodes[i].key ?? '')
    if (key === targetKey) return { parentId, indexTopFirst: i }
    const found = findLocation(nodes[i].children ?? [], targetKey, key)
    if (found) return found
  }
  return null
}
