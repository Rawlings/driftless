import { useState, useCallback } from 'react'
import type { Element } from '../../../core/types'

export function useEditorState() {
  const [elements, setElements] = useState<Element[]>(() => createStarterElements())
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const selectedId = selectedIds[0] ?? null

  const addElement = useCallback((
    type: Element['type'],
    position?: { left: number; top: number },
    styleOverrides?: Partial<Element['styles']>
  ) => {
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
      locked: false,
      hidden: false,
      styles: {
        ...styles,
        ...(styleOverrides ?? {})
      }
    }
    setElements(prev => [...prev, newElement])
    setSelectedIds([id])
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

  const deleteSelectedElement = useCallback(() => {
    if (!selectedId) {
      return
    }

    setElements((prev) => {
      const idSet = new Set<string>(selectedIds)

      let changed = true
      while (changed) {
        changed = false
        for (const element of prev) {
          if (element.parentId && idSet.has(element.parentId) && !idSet.has(element.id)) {
            idSet.add(element.id)
            changed = true
          }
        }
      }

      return prev.filter((element) => !idSet.has(element.id))
    })
    setSelectedIds([])
  }, [selectedIds])

  const duplicateSelectedElement = useCallback(() => {
    if (!selectedId) {
      return
    }

    setElements((prev) => {
      const byId = new Map(prev.map((element) => [element.id, element]))
      const root = byId.get(selectedId)
      if (!root) {
        return prev
      }

      const subtree: Element[] = []
      const queue: string[] = [selectedId]
      while (queue.length > 0) {
        const currentId = queue.shift()
        if (!currentId) {
          continue
        }
        const current = byId.get(currentId)
        if (!current) {
          continue
        }
        subtree.push(current)
        prev.forEach((element) => {
          if (element.parentId === currentId) {
            queue.push(element.id)
          }
        })
      }

      const idMap = new Map<string, string>()
      subtree.forEach((element, index) => {
        idMap.set(element.id, `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`)
      })

      const duplicates = subtree.map((element) => {
        const mappedParent = element.parentId ? idMap.get(element.parentId) ?? element.parentId : null
        const left = Number(element.styles.left ?? 0)
        const top = Number(element.styles.top ?? 0)

        return {
          ...element,
          id: idMap.get(element.id)!,
          parentId: mappedParent,
          styles: {
            ...element.styles,
            left: left + 24,
            top: top + 24
          }
        }
      })

      const next = [...prev, ...duplicates]
      setSelectedIds([idMap.get(selectedId) ?? selectedId])
      return next
    })
  }, [selectedId])

  const toggleSelectedLock = useCallback(() => {
    if (!selectedId) {
      return
    }

    setElements((prev) => prev.map((element) => {
      if (element.id !== selectedId) {
        return element
      }
      return {
        ...element,
        locked: !element.locked
      }
    }))
  }, [selectedId])

  const toggleSelectedVisibility = useCallback(() => {
    if (!selectedId) {
      return
    }

    setElements((prev) => prev.map((element) => {
      if (element.id !== selectedId) {
        return element
      }
      return {
        ...element,
        hidden: !element.hidden
      }
    }))
  }, [selectedId])

  const selectedElement = selectedId ? elements.find(el => el.id === selectedId) || null : null

  const setSelectedId = useCallback((id: string | null) => {
    setSelectedIds(id ? [id] : [])
  }, [])

  const setSelectedIdsSafe = useCallback((ids: string[]) => {
    setSelectedIds(ids)
  }, [])

  return {
    elements,
    selectedIds,
    selectedId,
    selectedElement,
    setSelectedId,
    setSelectedIds: setSelectedIdsSafe,
    addElement,
    updateElement,
    moveElementLayer,
    reorderElements,
    setElementParent,
    setElementParentAt,
    deleteSelectedElement,
    duplicateSelectedElement,
    toggleSelectedLock,
    toggleSelectedVisibility
  }
}

function createStarterElements(): Element[] {
  return [
    {
      id: 'starter-button',
      type: 'square',
      parentId: null,
      locked: false,
      hidden: false,
      styles: {
        position: 'absolute',
        left: 820,
        top: 520,
        width: 220,
        height: 56,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#0b3a8f',
        borderRadius: 999,
        backgroundColor: '#2563eb',
        boxShadow: 'none'
      }
    },
    {
      id: 'starter-button-label',
      type: 'text',
      parentId: 'starter-button',
      locked: false,
      hidden: false,
      styles: {
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        textMode: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 1.2,
        text: 'Hello world'
      }
    }
  ]
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