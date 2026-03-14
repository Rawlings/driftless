import { useEffect, useRef, useState } from 'react'
import { ElementRenderer } from './ElementRenderer'
import { isShapeTool, isTextTool } from '../../../core/editor/tools'
import { useEditorCommands, useEditorData } from '../state/EditorContext'

interface CreatingShapeState {
  id: string
  type: 'square' | 'circle' | 'line'
  startX: number
  startY: number
  stageLeft: number
  stageTop: number
  moved: boolean
}

interface CreatingTextState {
  id: string
  startX: number
  startY: number
  stageLeft: number
  stageTop: number
  moved: boolean
}

export function Canvas() {
  const { elements, selectedId, activeTool, viewportOffset } = useEditorData()
  const { addElement, clearSelection, setActiveTool, setViewportOffset, updateElement, setEditingTextId } = useEditorCommands()
  const [isPanning, setIsPanning] = useState(false)
  const [creatingShape, setCreatingShape] = useState<CreatingShapeState | null>(null)
  const [creatingText, setCreatingText] = useState<CreatingTextState | null>(null)
  const panStartMouseRef = useRef({ x: 0, y: 0 })
  const panStartOffsetRef = useRef({ x: 0, y: 0 })

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isElementTarget = Boolean(target.closest('[data-editor-element="true"]'))

    if (e.button === 1) {
      e.preventDefault()
      panStartMouseRef.current = { x: e.clientX, y: e.clientY }
      panStartOffsetRef.current = viewportOffset
      setIsPanning(true)
      return
    }

    if (activeTool === 'hand') {
      panStartMouseRef.current = { x: e.clientX, y: e.clientY }
      panStartOffsetRef.current = viewportOffset
      setIsPanning(true)
      return
    }

    if (e.button !== 0) {
      return
    }

    if (isElementTarget) {
      return
    }

    if (isShapeTool(activeTool)) {
      setEditingTextId(null)
      const bounds = e.currentTarget.getBoundingClientRect()
      const startX = Math.max(0, e.clientX - bounds.left - viewportOffset.x)
      const startY = Math.max(0, e.clientY - bounds.top - viewportOffset.y)

      const id = addElement(activeTool, { left: startX, top: startY })
      setCreatingShape({
        id,
        type: activeTool,
        startX,
        startY,
        stageLeft: bounds.left,
        stageTop: bounds.top,
        moved: false
      })
      return
    }

    if (isTextTool(activeTool)) {
      const bounds = e.currentTarget.getBoundingClientRect()
      const x = Math.max(0, e.clientX - bounds.left - viewportOffset.x)
      const y = Math.max(0, e.clientY - bounds.top - viewportOffset.y)
      const id = addElement('text', { left: x, top: y })
      setCreatingText({
        id,
        startX: x,
        startY: y,
        stageLeft: bounds.left,
        stageTop: bounds.top,
        moved: false
      })
      return
    }

    if (activeTool === 'move') {
      setEditingTextId(null)
      clearSelection()
    }
  }

  useEffect(() => {
    if (!creatingShape) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const worldX = e.clientX - creatingShape.stageLeft - viewportOffset.x
      const worldY = e.clientY - creatingShape.stageTop - viewportOffset.y

      const dx = worldX - creatingShape.startX
      const dy = worldY - creatingShape.startY

      const hasMoved = Math.abs(dx) > 2 || Math.abs(dy) > 2
      if (hasMoved && !creatingShape.moved) {
        setCreatingShape(prev => (prev ? { ...prev, moved: true } : prev))
      }

      const targetElement = elements.find((el) => el.id === creatingShape.id)
      if (!targetElement) {
        return
      }

      if (creatingShape.type === 'line') {
        const left = Math.min(creatingShape.startX, worldX)
        const top = Math.min(creatingShape.startY, worldY)
        const width = Math.max(2, Math.abs(dx))
        const height = Math.max(2, Math.abs(dy))
        updateElement(creatingShape.id, {
          styles: {
            ...targetElement.styles,
            left,
            top,
            width,
            height
          }
        })
        return
      }

      const left = Math.min(creatingShape.startX, worldX)
      const top = Math.min(creatingShape.startY, worldY)
      const width = Math.max(1, Math.abs(dx))
      const height = Math.max(1, Math.abs(dy))

      updateElement(creatingShape.id, {
        styles: {
          ...targetElement.styles,
          left,
          top,
          width,
          height,
          borderRadius: creatingShape.type === 'circle' ? '50%' : targetElement.styles.borderRadius
        }
      })
    }

    const handleMouseUp = () => {
      if (!creatingShape.moved) {
        const targetElement = elements.find((el) => el.id === creatingShape.id)
        if (targetElement) {
          updateElement(creatingShape.id, {
            styles: {
              ...targetElement.styles,
              left: Math.max(0, creatingShape.startX - 50),
              top: Math.max(0, creatingShape.startY - 50),
              width: 100,
              height: creatingShape.type === 'line' ? 2 : 100,
              borderRadius: creatingShape.type === 'circle' ? '50%' : targetElement.styles.borderRadius
            }
          })
        }
      }

      setActiveTool('move')
      setCreatingShape(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [creatingShape, elements, setActiveTool, updateElement, viewportOffset.x, viewportOffset.y])

  useEffect(() => {
    if (!creatingText) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const worldX = e.clientX - creatingText.stageLeft - viewportOffset.x
      const worldY = e.clientY - creatingText.stageTop - viewportOffset.y

      const dx = worldX - creatingText.startX
      const dy = worldY - creatingText.startY

      const hasMoved = Math.abs(dx) > 2 || Math.abs(dy) > 2
      if (hasMoved && !creatingText.moved) {
        setCreatingText(prev => (prev ? { ...prev, moved: true } : prev))
      }

      if (!hasMoved) {
        return
      }

      const targetElement = elements.find((el) => el.id === creatingText.id)
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

    const handleMouseUp = () => {
      if (!creatingText.moved) {
        const targetElement = elements.find((el) => el.id === creatingText.id)
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
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [creatingText, elements, setActiveTool, setEditingTextId, updateElement, viewportOffset.x, viewportOffset.y])

  useEffect(() => {
    if (!isPanning) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - panStartMouseRef.current.x
      const dy = e.clientY - panStartMouseRef.current.y
      setViewportOffset({
        x: panStartOffsetRef.current.x + dx,
        y: panStartOffsetRef.current.y + dy
      })
    }

    const handleMouseUp = () => {
      setIsPanning(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    // Prevent browser auto-scroll behavior for middle-mouse drag.
    const preventAuxClick = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault()
      }
    }
    window.addEventListener('mousedown', preventAuxClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousedown', preventAuxClick)
    }
  }, [isPanning, setViewportOffset])

  const canvasCursorClass = activeTool === 'hand'
    ? (isPanning ? 'cursor-grabbing' : 'cursor-grab')
    : isShapeTool(activeTool)
      ? 'cursor-crosshair'
      : 'cursor-default'

  return (
    <div
      data-editor-stage="true"
      className={`absolute inset-0 bg-gray-100 ${canvasCursorClass}`}
      onMouseDown={handleCanvasMouseDown}
    >
      <div
        className="absolute inset-0"
        style={{ transform: `translate(${viewportOffset.x}px, ${viewportOffset.y}px)` }}
      >
        {elements.map(element => (
          <ElementRenderer
            key={element.id}
            element={element}
            isSelected={selectedId === element.id}
          />
        ))}
      </div>
    </div>
  )
}