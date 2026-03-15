import { useEffect, useMemo, useState } from 'react'
import type { TreeNode } from 'primereact/treenode'
import type { Element } from '../../core/types'
import { getLayerLabel } from './layerUtils'

export function useLayerTree(elements: Element[], search: string) {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({})

  const treeNodes = useMemo<TreeNode[]>(() => {
    const childMap = new Map<string | null, Element[]>()
    const elementIndex = new Map<string, number>()

    elements.forEach((element, index) => {
      elementIndex.set(element.id, index)
      const key = element.parentId ?? null
      const list = childMap.get(key)
      if (list) list.push(element)
      else childMap.set(key, [element])
    })

    const buildNodes = (parentId: string | null): TreeNode[] =>
      [...(childMap.get(parentId) ?? [])].reverse().map((element) => {
        const index = elementIndex.get(element.id) ?? 0
        const label = getLayerLabel(element, index)
        return { key: element.id, label, data: { element, label }, children: buildNodes(element.id) }
      })

    return buildNodes(null)
  }, [elements])

  const filteredNodes = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return treeNodes

    const filter = (node: TreeNode): TreeNode | null => {
      const { element, label } = node.data as { element: Element; label: string }
      const children = (node.children ?? []).map(filter).filter(Boolean) as TreeNode[]
      if (label.toLowerCase().includes(query) || element.type.includes(query) || children.length > 0) {
        return { ...node, children }
      }
      return null
    }

    return treeNodes.map(filter).filter(Boolean) as TreeNode[]
  }, [search, treeNodes])

  useEffect(() => {
    setExpandedKeys((prev) => {
      const next: Record<string, boolean> = {}
      elements.forEach((el) => { next[el.id] = prev[el.id] ?? true })
      return next
    })
  }, [elements])

  return { filteredNodes, expandedKeys, setExpandedKeys }
}
