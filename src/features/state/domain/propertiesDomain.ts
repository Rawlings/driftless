import { useCallback, useMemo } from 'react'
import type { Element } from '../../../core/types'
import { useEditorCommands, useEditorData } from '../context'

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
