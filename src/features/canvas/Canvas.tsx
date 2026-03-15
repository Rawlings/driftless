import { useMemo } from 'react'
import { isShapeTool, isTextTool } from '../../core/tools'
import { useEditorCommands, useEditorData } from '../state/EditorContext'
import { CanvasScene } from './CanvasScene'
import { useCanvasPanZoom } from './useCanvasPanZoom'
import { useShapeCreation } from './useShapeCreation'
import { useTextCreation } from './useTextCreation'

export function Canvas() {
  const { elements, selectedId, activeTool, viewportOffset, viewportScale, snapGuides } = useEditorData()
  const { addElement, clearSelection, setActiveTool, setViewportOffset, setViewportScale, updateElement, setEditingTextId } = useEditorCommands()

  const elementsById = useMemo(() => {
    const map = new Map<string, (typeof elements)[number]>()
    elements.forEach((element) => {
      map.set(element.id, element)
    })
    return map
  }, [elements])

  const { stageRef, bindPan, handleWheelZoom, startMiddleMousePan, canvasCursorClass } = useCanvasPanZoom({
    activeTool,
    viewportOffset,
    viewportScale,
    setViewportOffset,
    setViewportScale
  })

  const { startShapeCreation, shapePreviewClassName, shapePreviewStyle } = useShapeCreation({
    addElement,
    setActiveTool,
    viewportOffset,
    viewportScale
  })

  const { startTextCreation } = useTextCreation({
    addElement,
    updateElement,
    setEditingTextId,
    setActiveTool,
    elementsById,
    viewportOffset,
    viewportScale
  })

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isElementTarget = Boolean(target.closest('[data-editor-element="true"]'))

    if (e.button === 1) {
      e.preventDefault()
      startMiddleMousePan(e.clientX, e.clientY)
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
      const startX = Math.max(0, (e.clientX - bounds.left - viewportOffset.x) / viewportScale)
      const startY = Math.max(0, (e.clientY - bounds.top - viewportOffset.y) / viewportScale)

      startShapeCreation(activeTool, {
        stageLeft: bounds.left,
        stageTop: bounds.top,
        startX,
        startY
      })
      return
    }

    if (isTextTool(activeTool)) {
      const bounds = e.currentTarget.getBoundingClientRect()
      const x = Math.max(0, (e.clientX - bounds.left - viewportOffset.x) / viewportScale)
      const y = Math.max(0, (e.clientY - bounds.top - viewportOffset.y) / viewportScale)
      startTextCreation({
        stageLeft: bounds.left,
        stageTop: bounds.top,
        startX: x,
        startY: y
      })
      return
    }

    if (activeTool === 'move' || activeTool === 'scale') {
      setEditingTextId(null)
      clearSelection()
    }
  }

  const effectiveCursorClass = isShapeTool(activeTool) ? 'cursor-crosshair' : canvasCursorClass

  return (
    <div
      ref={stageRef}
      data-editor-stage="true"
      className={`absolute inset-0 ${effectiveCursorClass}`}
      onAuxClick={(e) => {
        if (e.button === 1) {
          e.preventDefault()
        }
      }}
      onWheel={handleWheelZoom}
      onMouseDown={handleCanvasMouseDown}
      {...bindPan()}
    >
      <CanvasScene
        elements={elements}
        selectedId={selectedId}
        viewportOffset={viewportOffset}
        viewportScale={viewportScale}
        snapGuides={snapGuides}
        shapePreviewClassName={shapePreviewClassName}
        shapePreviewStyle={shapePreviewStyle}
      />
    </div>
  )
}