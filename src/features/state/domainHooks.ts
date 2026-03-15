import { useCallback, useMemo } from 'react'
import type { Element } from '../../core/types'
import { useEditorCommands, useEditorData } from './EditorContext'

export function useToolDomain() {
  const { activeTool } = useEditorData()
  const { setActiveTool } = useEditorCommands()

  return useMemo(
    () => ({ activeTool, setActiveTool }),
    [activeTool, setActiveTool]
  )
}

export function useViewportDomain() {
  const { viewportScale } = useEditorData()
  const { setViewportScale } = useEditorCommands()

  return useMemo(
    () => ({ viewportScale, setViewportScale }),
    [viewportScale, setViewportScale]
  )
}

export function useSelectionQueryDomain() {
  const { selectedId, selectedElement } = useEditorData()

  const hasSelection = Boolean(selectedId)
  const isLocked = Boolean(selectedElement?.locked)
  const isHidden = Boolean(selectedElement?.hidden)

  return useMemo(
    () => ({
      selectedId,
      selectedElement,
      hasSelection,
      isLocked,
      isHidden,
    }),
    [
      selectedId,
      selectedElement,
      hasSelection,
      isLocked,
      isHidden,
    ]
  )
}

export function useSelectionCommandDomain() {
  const { selectedId } = useEditorData()
  const {
    duplicateSelectedElement,
    deleteSelectedElement,
    moveElementLayer,
    toggleSelectedLock,
    toggleSelectedVisibility,
  } = useEditorCommands()

  const moveSelectionLayer = useCallback(
    (direction: 'front' | 'back') => {
      if (!selectedId) return
      moveElementLayer(selectedId, direction)
    },
    [moveElementLayer, selectedId]
  )

  return useMemo(
    () => ({
      duplicateSelectedElement,
      deleteSelectedElement,
      moveSelectionLayer,
      toggleSelectedLock,
      toggleSelectedVisibility,
    }),
    [
      duplicateSelectedElement,
      deleteSelectedElement,
      moveSelectionLayer,
      toggleSelectedLock,
      toggleSelectedVisibility,
    ]
  )
}

export function usePropertiesQueryDomain() {
  const { selectedElement } = useEditorData()

  return useMemo(
    () => ({ selectedElement }),
    [selectedElement]
  )
}

export function usePropertiesCommandDomain() {
  const { selectedElement } = useEditorData()
  const { updateElement } = useEditorCommands()

  const updateSelectedStyleProperty = useCallback(
    (cssProperty: string, value: Element['styles'][string]) => {
      if (!selectedElement) return

      updateElement(selectedElement.id, {
        styles: {
          ...selectedElement.styles,
          [cssProperty]: value,
        }
      })
    },
    [selectedElement, updateElement]
  )

  return useMemo(
    () => ({ updateSelectedStyleProperty }),
    [updateSelectedStyleProperty]
  )
}

export function useLayersQueryDomain() {
  const { elements, selectedId } = useEditorData()

  return useMemo(
    () => ({ elements, selectedId }),
    [elements, selectedId]
  )
}

export function useLayersCommandDomain() {
  const { selectElement, moveElementLayer, setElementParentAt } = useEditorCommands()

  const moveLayer = useCallback(
    (id: string | null | undefined, direction: 'up' | 'down') => {
      if (!id) return
      moveElementLayer(id, direction)
    },
    [moveElementLayer]
  )

  const reparentLayer = useCallback(
    (id: string | null | undefined, parentId: string | null, indexTopFirst: number) => {
      if (!id) return
      setElementParentAt(id, parentId, indexTopFirst)
    },
    [setElementParentAt]
  )

  return useMemo(
    () => ({ selectElement, moveLayer, reparentLayer }),
    [selectElement, moveLayer, reparentLayer]
  )
}

export function useCanvasQueryDomain() {
  const {
    elements,
    selectedIds,
    selectedId,
    activeTool,
    viewportOffset,
    viewportScale,
    editingTextId,
    snapGuides,
  } = useEditorData()

  return useMemo(
    () => ({
      elements,
      selectedIds,
      selectedId,
      activeTool,
      viewportOffset,
      viewportScale,
      editingTextId,
      snapGuides,
    }),
    [
      elements,
      selectedIds,
      selectedId,
      activeTool,
      viewportOffset,
      viewportScale,
      editingTextId,
      snapGuides,
    ]
  )
}

export function useCanvasCommandDomain() {
  const {
    addElement,
    updateElement,
    clearSelection,
    selectElement,
    selectElements,
    setActiveTool,
    setViewportOffset,
    setViewportScale,
    setEditingTextId,
    setSnapGuides,
  } = useEditorCommands()

  const startTextEditing = useCallback((id: string) => {
    setEditingTextId(id)
  }, [setEditingTextId])

  const stopTextEditing = useCallback(() => {
    setEditingTextId(null)
  }, [setEditingTextId])

  const clearSnapGuides = useCallback(() => {
    setSnapGuides([])
  }, [setSnapGuides])

  const updateSnapGuides = useCallback((guides: Array<{ type: 'v' | 'h'; position: number }>) => {
    setSnapGuides(guides)
  }, [setSnapGuides])

  const clearCanvasSelection = useCallback(() => {
    stopTextEditing()
    clearSelection()
  }, [clearSelection, stopTextEditing])

  return useMemo(
    () => ({
      addElement,
      updateElement,
      clearCanvasSelection,
      clearSnapGuides,
      updateSnapGuides,
      startTextEditing,
      stopTextEditing,
      selectElement,
      selectElements,
      setActiveTool,
      setViewportOffset,
      setViewportScale,
    }),
    [
      addElement,
      updateElement,
      clearCanvasSelection,
      clearSnapGuides,
      updateSnapGuides,
      startTextEditing,
      stopTextEditing,
      selectElement,
      selectElements,
      setActiveTool,
      setViewportOffset,
      setViewportScale,
    ]
  )
}
