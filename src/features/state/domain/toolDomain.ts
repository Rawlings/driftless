import { useMemo } from 'react'
import { useEditorCommands, useEditorData } from '../context'

export function useToolDomain() {
  const { activeTool } = useEditorData()
  const { setActiveTool } = useEditorCommands()

  return useMemo(
    () => ({ activeTool, setActiveTool }),
    [activeTool, setActiveTool]
  )
}
