import { useCallback, useMemo } from 'react'
import { useEditorCommands, useEditorData } from '../context'

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
