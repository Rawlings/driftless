import { useState, useCallback } from 'react'
import type { Element } from '../../core/editor/types'

export function useEditorState() {
  const [elements, setElements] = useState<Element[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addElement = useCallback((type: Element['type'], position?: { left: number; top: number }) => {
    const id = Date.now().toString()
    const baseStyles = {
      position: 'absolute',
      left: position?.left ?? 100,
      top: position?.top ?? 100,
      boxShadow: 'none'
    }

    const styles = type === 'text'
      ? {
          ...baseStyles,
          width: 'auto',
          height: 'auto',
          minHeight: 0,
          borderWidth: 0,
          borderStyle: 'solid',
          borderColor: '#0f172a',
          backgroundColor: 'transparent',
          color: '#0f172a',
          fontSize: 20,
          fontWeight: 500,
          lineHeight: 1.2,
          padding: 0,
          borderRadius: 0,
          textMode: 'auto',
          text: 'Text'
        }
      : {
          ...baseStyles,
          width: 100,
          height: type === 'line' ? 3 : 100,
          borderWidth: type === 'line' ? 0 : 3,
          borderStyle: 'solid',
          borderColor: '#0f172a',
          borderRadius: type === 'circle' ? '50%' : 0,
          backgroundColor: type === 'line' ? '#0f172a' : 'transparent'
        }

    const newElement: Element = {
      id,
      type,
      parentId: null,
      styles
    }
    setElements(prev => [...prev, newElement])
    setSelectedId(id)
    return id
  }, [])

  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el))
  }, [])

  const moveElementLayer = useCallback((id: string, direction: 'up' | 'down' | 'front' | 'back') => {
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id)
      if (index < 0) {
        return prev
      }

      const next = [...prev]
      const [item] = next.splice(index, 1)

      if (direction === 'front') {
        next.push(item)
        return next
      }

      if (direction === 'back') {
        next.unshift(item)
        return next
      }

      if (direction === 'up') {
        const targetIndex = Math.min(next.length, index + 1)
        next.splice(targetIndex, 0, item)
        return next
      }

      const targetIndex = Math.max(0, index - 1)
      next.splice(targetIndex, 0, item)
      return next
    })
  }, [])

  const reorderElements = useCallback((orderedIds: string[]) => {
    setElements((prev) => {
      if (orderedIds.length !== prev.length) {
        return prev
      }

      const byId = new Map(prev.map((element) => [element.id, element]))
      const next = orderedIds.map((id) => byId.get(id)).filter((element): element is Element => Boolean(element))

      if (next.length !== prev.length) {
        return prev
      }

      return next
    })
  }, [])

  const setElementParent = useCallback((id: string, parentId: string | null) => {
    setElements((prev) => {
      const siblingCount = prev.filter((element) => (element.parentId ?? null) === (parentId ?? null) && element.id !== id).length
      return applyParentPlacement(prev, id, parentId, siblingCount)
    })
  }, [])

  const setElementParentAt = useCallback((id: string, parentId: string | null, insertIndexTopFirst: number) => {
    setElements((prev) => applyParentPlacement(prev, id, parentId, insertIndexTopFirst))
  }, [])

  const selectedElement = selectedId ? elements.find(el => el.id === selectedId) || null : null

  return {
    elements,
    selectedId,
    selectedElement,
    setSelectedId,
    addElement,
    updateElement,
    moveElementLayer,
    reorderElements,
    setElementParent,
    setElementParentAt
  }
}

function applyParentPlacement(prev: Element[], id: string, parentId: string | null, insertIndexTopFirst: number) {
  const byId = new Map(prev.map((element) => [element.id, element]))
  const target = byId.get(id)
  if (!target) {
    return prev
  }

  if (parentId === id) {
    return prev
  }

  if (parentId && !byId.has(parentId)) {
    return prev
  }

  // Prevent cycles by ensuring the requested parent is not inside target subtree.
  let cursor = parentId
  while (cursor) {
    if (cursor === id) {
      return prev
    }
    cursor = byId.get(cursor)?.parentId ?? null
  }

  const getWorldPosition = (elementId: string) => {
    let x = 0
    let y = 0
    let currentId: string | null = elementId

    while (currentId) {
      const current = byId.get(currentId)
      if (!current) {
        break
      }
      x += Number(current.styles.left ?? 0)
      y += Number(current.styles.top ?? 0)
      currentId = current.parentId ?? null
    }

    return { x, y }
  }

  const targetWorld = getWorldPosition(id)
  const parentWorld = parentId ? getWorldPosition(parentId) : { x: 0, y: 0 }

  const updatedTarget: Element = {
    ...target,
    parentId,
    styles: {
      ...target.styles,
      left: targetWorld.x - parentWorld.x,
      top: targetWorld.y - parentWorld.y
    }
  }

  const remaining = prev.filter((element) => element.id !== id)
  const siblingsStorage = remaining.filter((element) => (element.parentId ?? null) === (parentId ?? null))
  const siblingsTopFirst = [...siblingsStorage].reverse()
  const clampedIndex = Math.max(0, Math.min(insertIndexTopFirst, siblingsTopFirst.length))

  const nextSiblingsTopFirst = [...siblingsTopFirst]
  nextSiblingsTopFirst.splice(clampedIndex, 0, updatedTarget)
  const nextSiblingsStorage = [...nextSiblingsTopFirst].reverse()

  const firstSiblingIndex = remaining.findIndex((element) => (element.parentId ?? null) === (parentId ?? null))
  const withoutSiblingGroup = remaining.filter((element) => (element.parentId ?? null) !== (parentId ?? null))

  if (firstSiblingIndex < 0) {
    return [...remaining, ...nextSiblingsStorage]
  }

  return [
    ...withoutSiblingGroup.slice(0, firstSiblingIndex),
    ...nextSiblingsStorage,
    ...withoutSiblingGroup.slice(firstSiblingIndex)
  ]
}