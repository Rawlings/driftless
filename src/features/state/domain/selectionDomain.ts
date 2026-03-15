import { useCallback, useMemo } from 'react'
import { useEditorCommands, useEditorData } from '../context'

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
