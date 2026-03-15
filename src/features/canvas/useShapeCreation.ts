import { useEffect, useMemo, useState } from 'react'
import type { Element } from '../../core/types'
import type { EditorToolId } from '../../core/tools'
import type { CreatingShapeState, Point } from './canvasTypes'

interface UseShapeCreationParams {
  addElement: (type: Element['type'], position?: { left: number; top: number }, styleOverrides?: Partial<Element['styles']>) => string
  setActiveTool: (tool: EditorToolId) => void
  viewportOffset: Point
  viewportScale: number
}

export function useShapeCreation({
  addElement,
  setActiveTool,
  viewportOffset,
  viewportScale
}: UseShapeCreationParams) {
  const [creatingShape, setCreatingShape] = useState<CreatingShapeState | null>(null)

  const startShapeCreation = (
    type: 'square' | 'circle' | 'line',
    payload: { stageLeft: number; stageTop: number; startX: number; startY: number }
  ) => {
    const { stageLeft, stageTop, startX, startY } = payload
    setCreatingShape({
      type,
      startX,
      startY,
      currentX: startX,
      currentY: startY,
      stageLeft,
      stageTop,
      moved: false
    })
  }

  useEffect(() => {
    if (!creatingShape) {
      return
    }

    let latestPointer: Point | null = null
    let rafId: number | null = null

    const updatePreview = (clientX: number, clientY: number) => {
      const worldX = (clientX - creatingShape.stageLeft - viewportOffset.x) / viewportScale
      const worldY = (clientY - creatingShape.stageTop - viewportOffset.y) / viewportScale

      const dx = worldX - creatingShape.startX
      const dy = worldY - creatingShape.startY
      const hasMoved = Math.abs(dx) > 2 || Math.abs(dy) > 2

      setCreatingShape((prev) => {
        if (!prev) {
          return prev
        }

        return {
          ...prev,
          currentX: worldX,
          currentY: worldY,
          moved: prev.moved || hasMoved
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
        updatePreview(latestPointer.x, latestPointer.y)
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
        updatePreview(latestPointer.x, latestPointer.y)
      }

      const final = latestPointer
        ? {
            x: (latestPointer.x - creatingShape.stageLeft - viewportOffset.x) / viewportScale,
            y: (latestPointer.y - creatingShape.stageTop - viewportOffset.y) / viewportScale
          }
        : { x: creatingShape.currentX, y: creatingShape.currentY }

      const dx = final.x - creatingShape.startX
      const dy = final.y - creatingShape.startY
      const hasMoved = creatingShape.moved || Math.abs(dx) > 2 || Math.abs(dy) > 2

      if (!hasMoved) {
        addElement(creatingShape.type, {
          left: Math.max(0, creatingShape.startX - 50),
          top: Math.max(0, creatingShape.startY - 50)
        }, {
          width: 100,
          height: creatingShape.type === 'line' ? 2 : 100,
          borderRadius: creatingShape.type === 'circle' ? '50%' : 0
        })
      } else {
        const left = Math.min(creatingShape.startX, final.x)
        const top = Math.min(creatingShape.startY, final.y)
        const width = Math.max(creatingShape.type === 'line' ? 2 : 1, Math.abs(dx))
        const height = Math.max(creatingShape.type === 'line' ? 2 : 1, Math.abs(dy))

        addElement(creatingShape.type, { left, top }, {
          width,
          height,
          borderRadius: creatingShape.type === 'circle' ? '50%' : 0
        })
      }

      setActiveTool('move')
      setCreatingShape(null)
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
  }, [addElement, creatingShape, setActiveTool, viewportOffset.x, viewportOffset.y, viewportScale])

  const shapePreviewStyle = useMemo(() => {
    if (!creatingShape) {
      return null
    }

    return {
      left: Math.min(creatingShape.startX, creatingShape.currentX),
      top: Math.min(creatingShape.startY, creatingShape.currentY),
      width: Math.max(creatingShape.type === 'line' ? 2 : 1, Math.abs(creatingShape.currentX - creatingShape.startX)),
      height: Math.max(creatingShape.type === 'line' ? 2 : 1, Math.abs(creatingShape.currentY - creatingShape.startY))
    }
  }, [creatingShape])

  const shapePreviewClassName = useMemo(() => {
    if (!creatingShape) {
      return ''
    }
    return `pointer-events-none absolute ${creatingShape.type === 'circle' ? 'rounded-full' : ''} ${creatingShape.type === 'line' ? 'bg-[var(--text-color)]' : 'border-2 border-[var(--text-color)] bg-transparent'}`
  }, [creatingShape])

  return {
    creatingShape,
    startShapeCreation,
    shapePreviewClassName,
    shapePreviewStyle
  }
}
