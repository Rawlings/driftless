import { useState, useEffect, useCallback } from 'react'
import type { Element } from '../core/types'
import type { EditorToolId } from '../core/tools'

interface UseInteractionsProps {
  selectedId: string | null
  activeTool: EditorToolId
  editingTextId: string | null
  viewportOffset: { x: number; y: number }
  elements: Element[]
  setSelectedId: (id: string | null) => void
  updateElement: (id: string, updates: Partial<Element>) => void
}

export function useInteractions({ selectedId, activeTool, editingTextId, viewportOffset, elements, setSelectedId, updateElement }: UseInteractionsProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (activeTool !== 'move') {
      return
    }

    if (editingTextId === id) {
      return
    }

    if (e.button !== 0) {
      return
    }

    e.stopPropagation()

    const el = elements.find(el => el.id === id)
    if (el) {
      const left = Number(el.styles.left ?? el.styles.x ?? 0)
      const top = Number(el.styles.top ?? el.styles.y ?? 0)
      const worldX = e.clientX - viewportOffset.x
      const worldY = e.clientY - viewportOffset.y
      setSelectedId(id)
      setIsDragging(true)
      setDragOffset({
        x: worldX - left,
        y: worldY - top
      })
    }
  }, [activeTool, editingTextId, elements, setSelectedId, viewportOffset.x, viewportOffset.y])

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (activeTool !== 'move') {
      return
    }

    if (editingTextId === id) {
      return
    }

    if (e.button !== 0) {
      return
    }

    e.stopPropagation()

    const el = elements.find(el => el.id === id)
    if (el) {
      setSelectedId(id)
      setIsResizing(true)
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: el.styles.width,
        height: el.styles.height
      })
    }
  }, [activeTool, editingTextId, elements, setSelectedId])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && selectedId) {
      const worldX = e.clientX - viewportOffset.x
      const worldY = e.clientY - viewportOffset.y
      const newX = worldX - dragOffset.x
      const newY = worldY - dragOffset.y
      const el = elements.find(el => el.id === selectedId)
      if (!el) {
        return
      }
      updateElement(selectedId, { styles: { ...el.styles, left: newX, top: newY } })
    } else if (isResizing && selectedId) {
      const el = elements.find(el => el.id === selectedId)
      if (!el) {
        return
      }
      const newWidth = Math.max(10, resizeStart.width + (e.clientX - resizeStart.x))
      const newHeight = Math.max(10, resizeStart.height + (e.clientY - resizeStart.y))
      updateElement(selectedId, { styles: { ...el.styles, width: newWidth, height: newHeight } })
    }
  }, [isDragging, isResizing, selectedId, dragOffset, resizeStart, elements, updateElement, viewportOffset.x, viewportOffset.y])

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