import { useState, useEffect, useCallback } from 'react'
import type { Element, DragState, ResizeState } from './types'

interface UseInteractionsProps {
  selectedId: string | null
  elements: Element[]
  updateElement: (id: string, updates: Partial<Element>) => void
}

export function useInteractions({ selectedId, elements, updateElement }: UseInteractionsProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const el = elements.find(el => el.id === id)
    if (el) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - el.styles.x,
        y: e.clientY - el.styles.y
      })
    }
  }, [elements])

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const el = elements.find(el => el.id === id)
    if (el) {
      setIsResizing(true)
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: el.styles.width,
        height: el.styles.height
      })
    }
  }, [elements])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && selectedId) {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      const el = elements.find(el => el.id === selectedId)!
      updateElement(selectedId, { styles: { ...el.styles, x: newX, y: newY } })
    } else if (isResizing && selectedId) {
      const el = elements.find(el => el.id === selectedId)!
      const newWidth = Math.max(10, resizeStart.width + (e.clientX - resizeStart.x))
      const newHeight = Math.max(10, resizeStart.height + (e.clientY - resizeStart.y))
      updateElement(selectedId, { styles: { ...el.styles, width: newWidth, height: newHeight } })
    }
  }, [isDragging, isResizing, selectedId, dragOffset, resizeStart, elements, updateElement])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  return {
    isDragging,
    isResizing,
    handleMouseDown,
    handleResizeMouseDown
  }
}