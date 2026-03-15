import { useMemo } from 'react'
import { useEditorCommands, useEditorData } from '../context'

export function useViewportDomain() {
  const { viewportScale } = useEditorData()
  const { setViewportScale } = useEditorCommands()

  return useMemo(
    () => ({ viewportScale, setViewportScale }),
    [viewportScale, setViewportScale]
  )
}
