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
      styles
    }
    setElements(prev => [...prev, newElement])
    setSelectedId(id)
    return id
  }, [])

  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el))
  }, [])

  const selectedElement = selectedId ? elements.find(el => el.id === selectedId) || null : null

  return {
    elements,
    selectedId,
    selectedElement,
    setSelectedId,
    addElement,
    updateElement
  }
}