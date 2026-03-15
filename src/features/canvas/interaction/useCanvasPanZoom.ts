import { useEffect, useMemo, useRef, useState, type WheelEvent } from 'react'
import { useDrag } from '@use-gesture/react'
import type { EditorToolId } from '../../../core/tools'
import { canPanFromPointer, resolveCanvasIdleCursorClass } from './interactionMachine'
import type { Point } from '../model/canvasTypes'

interface UseCanvasPanZoomParams {
  activeTool: EditorToolId
  viewportOffset: Point
  viewportScale: number
  setViewportOffset: (offset: Point) => void
  setViewportScale: (scale: number) => void
  canStartPan?: (source: 'tool' | 'middle-mouse') => boolean
  onPanStart?: (source: 'tool' | 'middle-mouse') => void
  onPanEnd?: () => void
}

interface MiddleMousePanState {
  x: number
  y: number
  offsetX: number
  offsetY: number
}

export function useCanvasPanZoom({
  activeTool,
  viewportOffset,
  viewportScale,
  setViewportOffset,
  setViewportScale,
  canStartPan,
  onPanStart,
  onPanEnd,
}: UseCanvasPanZoomParams) {
  const [isPanning, setIsPanning] = useState(false)
  const [middleMousePanStart, setMiddleMousePanStart] = useState<MiddleMousePanState | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)

  const clampScale = (scale: number) => Math.max(0.2, Math.min(4, scale))

  const bindPan = useDrag(
    ({ first, last, movement: [mx, my], memo, event }) => {
      const pointerEvent = event as MouseEvent
      const allowPan = canPanFromPointer(activeTool, pointerEvent.buttons)
      const panMemo = (memo ?? { x: viewportOffset.x, y: viewportOffset.y }) as Point

      if (!allowPan) {
        return panMemo
      }

      event.preventDefault()

      if (first) {
        const source = (pointerEvent.buttons & 4) === 4 ? 'middle-mouse' : 'tool'
        if (canStartPan && !canStartPan(source)) {
          return panMemo
        }
        setIsPanning(true)
        onPanStart?.(source)
        return { x: viewportOffset.x, y: viewportOffset.y }
      }

      setViewportOffset({
        x: panMemo.x + mx,
        y: panMemo.y + my
      })

      if (last) {
        setIsPanning(false)
        onPanEnd?.()
      }

      return panMemo
    },
    { filterTaps: true }
  )

  const handleWheelZoom = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault()

    const stage = stageRef.current
    if (!stage) {
      return
    }

    const rect = stage.getBoundingClientRect()
    const screenX = e.clientX - rect.left
    const screenY = e.clientY - rect.top

    const worldX = (screenX - viewportOffset.x) / viewportScale
    const worldY = (screenY - viewportOffset.y) / viewportScale

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9
    const nextScale = clampScale(viewportScale * zoomFactor)

    setViewportScale(nextScale)
    setViewportOffset({
      x: screenX - worldX * nextScale,
      y: screenY - worldY * nextScale
    })
  }

  const startMiddleMousePan = (clientX: number, clientY: number) => {
    if (canStartPan && !canStartPan('middle-mouse')) {
      return
    }
    setIsPanning(true)
    onPanStart?.('middle-mouse')
    setMiddleMousePanStart({
      x: clientX,
      y: clientY,
      offsetX: viewportOffset.x,
      offsetY: viewportOffset.y
    })
  }

  useEffect(() => {
    if (!middleMousePanStart) {
      return
    }

    const previousCursor = document.body.style.cursor
    document.body.style.cursor = 'grabbing'

    const handleMouseMove = (e: MouseEvent) => {
      setViewportOffset({
        x: middleMousePanStart.offsetX + (e.clientX - middleMousePanStart.x),
        y: middleMousePanStart.offsetY + (e.clientY - middleMousePanStart.y)
      })
    }

    const handleMouseUp = () => {
      setMiddleMousePanStart(null)
      setIsPanning(false)
      onPanEnd?.()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = previousCursor
    }
  }, [middleMousePanStart, onPanEnd, setViewportOffset])

  const canvasCursorClass = useMemo(() => {
    if (isPanning) {
      return 'cursor-grabbing'
    }
    return resolveCanvasIdleCursorClass(activeTool)
  }, [activeTool, isPanning])

  return {
    stageRef,
    bindPan,
    handleWheelZoom,
    startMiddleMousePan,
    canvasCursorClass
  }
}
