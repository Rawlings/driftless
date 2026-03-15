import { useEffect, useState } from 'react'
import type { Element } from '../../core/types'
import type { EditorToolId } from '../../core/tools'
import type { CreatingTextState, Point } from './canvasTypes'

interface UseTextCreationParams {
  addElement: (type: Element['type'], position?: { left: number; top: number }, styleOverrides?: Partial<Element['styles']>) => string
  updateElement: (id: string, updates: Partial<Element>) => void
  setEditingTextId: (id: string | null) => void
  setActiveTool: (tool: EditorToolId) => void
  elementsById: Map<string, Element>
  viewportOffset: Point
  viewportScale: number
}

export function useTextCreation({
  addElement,
  updateElement,
  setEditingTextId,
  setActiveTool,
  elementsById,
  viewportOffset,
  viewportScale
}: UseTextCreationParams) {
  const [creatingText, setCreatingText] = useState<CreatingTextState | null>(null)

  const startTextCreation = (payload: { stageLeft: number; stageTop: number; startX: number; startY: number }) => {
    const { stageLeft, stageTop, startX, startY } = payload
    const id = addElement('text', { left: startX, top: startY })
    setCreatingText({
      id,
      startX,
      startY,
      stageLeft,
      stageTop,
      moved: false
    })
  }

  useEffect(() => {
    if (!creatingText) {
      return
    }

    let moved = creatingText.moved
    let latestPointer: Point | null = null
    let rafId: number | null = null

    const applyTextPreview = (clientX: number, clientY: number) => {
      const worldX = (clientX - creatingText.stageLeft - viewportOffset.x) / viewportScale
      const worldY = (clientY - creatingText.stageTop - viewportOffset.y) / viewportScale

      const dx = worldX - creatingText.startX
      const dy = worldY - creatingText.startY

      const hasMoved = Math.abs(dx) > 2 || Math.abs(dy) > 2
      if (hasMoved && !moved) {
        moved = true
        setCreatingText(prev => (prev ? { ...prev, moved: true } : prev))
      }

      if (!hasMoved) {
        return
      }

      const targetElement = elementsById.get(creatingText.id)
      if (!targetElement) {
        return
      }

      const left = Math.min(creatingText.startX, worldX)
      const top = Math.min(creatingText.startY, worldY)
      const width = Math.max(120, Math.abs(dx))
      const height = Math.max(32, Math.abs(dy))

      updateElement(creatingText.id, {
        styles: {
          ...targetElement.styles,
          left,
          top,
          width,
          height,
          minHeight: height,
          textMode: 'fixed'
        }
      })
    }

    const schedulePreviewUpdate = () => {
      if (rafId != null) {
        return
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null
        if (!latestPointer) {
          return
        }
        applyTextPreview(latestPointer.x, latestPointer.y)
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      latestPointer = { x: e.clientX, y: e.clientY }
      schedulePreviewUpdate()
    }

    const handleMouseUp = () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId)
        rafId = null
      }

      if (latestPointer) {
        applyTextPreview(latestPointer.x, latestPointer.y)
      }

      if (!moved) {
        const targetElement = elementsById.get(creatingText.id)
        if (targetElement) {
          updateElement(creatingText.id, {
            styles: {
              ...targetElement.styles,
              left: creatingText.startX,
              top: creatingText.startY,
              width: 'auto',
              height: 'auto',
              minHeight: 0,
              textMode: 'auto'
            }
          })
        }
      }

      setEditingTextId(creatingText.id)
      setActiveTool('move')
      setCreatingText(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [creatingText, elementsById, setActiveTool, setEditingTextId, updateElement, viewportOffset.x, viewportOffset.y, viewportScale])

  return {
    creatingText,
    startTextCreation
  }
}
