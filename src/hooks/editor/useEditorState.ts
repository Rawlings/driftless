import { useState, useCallback } from 'react'
import type { Element } from '../../core/editor/types'

export function useEditorState() {
  const [elements, setElements] = useState<Element[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addElement = useCallback((type: Element['type']) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type,
      styles: {
        position: 'absolute',
        left: 100,
        top: 100,
        width: 100,
        height: type === 'line' ? 2 : 100,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#000000',
        borderRadius: type === 'circle' ? 50 : 0,
        backgroundColor: '#000000',
        boxShadow: 'none'
      }
    }
    setElements(prev => [...prev, newElement])
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