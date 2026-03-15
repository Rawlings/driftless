import { useCallback, useMemo } from 'react'
import { useEditorCommands, useEditorData } from '../context'

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
