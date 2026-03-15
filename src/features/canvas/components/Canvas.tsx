import { useMemo } from 'react'
import { useMachine } from '@xstate/react'
import { useCanvasCommandDomain, useCanvasQueryDomain } from '../../state'
import { CanvasScene } from './CanvasScene'
import {
  canvasInteractionMachine,
  resolveCanvasCursorClass,
  resolveCanvasBackgroundResolution,
  resolveCanvasPointerDownAction,
  type CanvasInteractionEvent,
} from '../interaction/interactionMachine'
import { useCanvasPanZoom } from '../interaction/useCanvasPanZoom'
import { useMarqueeSelection } from '../interaction/useMarqueeSelection'
import { useShapeCreation } from '../interaction/useShapeCreation'
import { useTextCreation } from '../interaction/useTextCreation'

export function Canvas() {
  const [interactionState, sendInteraction] = useMachine(canvasInteractionMachine)
  const {
    elements,
    selectedIds,
    selectedId,
    activeTool,
    viewportOffset,
    viewportScale,
    snapGuides,
  } = useCanvasQueryDomain()
  const {
    addElement,
    updateElement,
    clearCanvasSelection,
    stopTextEditing,
    startTextEditing,
    selectElements,
    setActiveTool,
    setViewportOffset,
    setViewportScale,
  } = useCanvasCommandDomain()

  const elementsById = useMemo(() => {
    const map = new Map<string, (typeof elements)[number]>()
    elements.forEach((element) => {
      map.set(element.id, element)
    })
    return map
  }, [elements])

  const dispatchInteraction = (event: CanvasInteractionEvent): boolean => {
    if (!interactionState.can(event)) {
      return false
    }
    sendInteraction(event)
    return true
  }

  const { stageRef, bindPan, handleWheelZoom, startMiddleMousePan, canvasCursorClass } = useCanvasPanZoom({
    activeTool,
    viewportOffset,
    viewportScale,
    setViewportOffset,
    setViewportScale,
    canStartPan: (source) => interactionState.can({ type: 'PAN_START', source }),
    onPanStart: (source) => {
      dispatchInteraction({ type: 'PAN_START', source })
    },
    onPanEnd: () => {
      dispatchInteraction({ type: 'PAN_END' })
    },
  })

  const { startShapeCreation, shapePreviewClassName, shapePreviewStyle } = useShapeCreation({
    addElement,
    setActiveTool,
    onCreationEnd: () => {
      dispatchInteraction({ type: 'SHAPE_CREATION_END' })
    },
    viewportOffset,
    viewportScale
  })

  const { startTextCreation } = useTextCreation({
    addElement,
    updateElement,
    startTextEditing,
    setActiveTool,
    onCreationEnd: () => {
      dispatchInteraction({ type: 'TEXT_CREATION_END' })
    },
    elementsById,
    viewportOffset,
    viewportScale
  })

  const sendInteractionSignal = (event: CanvasInteractionEvent): boolean => {
    return dispatchInteraction(event)
  }
  const { marqueeStyle, startMarquee } = useMarqueeSelection({
    elements,
    viewportOffset,
    viewportScale,
    stageRef,
    stopTextEditing,
    selectElements,
    clearCanvasSelection,
  })

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isElementTarget = Boolean(target.closest('[data-editor-element="true"]'))
    const pointerDownAction = resolveCanvasPointerDownAction(e.button, isElementTarget)

    if (pointerDownAction.type === 'start-middle-pan') {
      e.preventDefault()
      startMiddleMousePan(e.clientX, e.clientY)
      return
    }

    if (pointerDownAction.type === 'ignore') {
      return
    }

    const bounds = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, (e.clientX - bounds.left - viewportOffset.x) / viewportScale)
    const y = Math.max(0, (e.clientY - bounds.top - viewportOffset.y) / viewportScale)
    const backgroundAction = resolveCanvasBackgroundResolution(interactionState, activeTool, { x, y })

    if (backgroundAction.type === 'clear-selection' && activeTool === 'move') {
      startMarquee(x, y)
      return
    }

    if (backgroundAction.type === 'start-shape') {
      const started = dispatchInteraction(backgroundAction.interactionEvent)
      if (!started) {
        return
      }
      stopTextEditing()

      startShapeCreation(backgroundAction.shapeTool, {
        stageLeft: bounds.left,
        stageTop: bounds.top,
        startX: x,
        startY: y
      })
      return
    }

    if (backgroundAction.type === 'start-text') {
      const started = dispatchInteraction(backgroundAction.interactionEvent)
      if (!started) {
        return
      }

      startTextCreation({
        stageLeft: bounds.left,
        stageTop: bounds.top,
        startX: x,
        startY: y
      })
      return
    }

    if (backgroundAction.type === 'clear-selection') {
      clearCanvasSelection()
      dispatchInteraction({ type: 'CANCEL' })
    }
  }

  const effectiveCursorClass = resolveCanvasCursorClass(interactionState, activeTool, canvasCursorClass)

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
        selectedIds={selectedIds}
        viewportOffset={viewportOffset}
        viewportScale={viewportScale}
        snapGuides={snapGuides}
        shapePreviewClassName={shapePreviewClassName}
        shapePreviewStyle={shapePreviewStyle}
        marqueeStyle={marqueeStyle}
        onElementInteractionSignal={sendInteractionSignal}
      />
    </div>
  )
}