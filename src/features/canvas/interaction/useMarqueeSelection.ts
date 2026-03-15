import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import type { Element } from '../../../core/types'
import type { Point } from '../model/canvasTypes'

interface MarqueeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
}

interface SelectableRect {
  id: string
  left: number
  top: number
  right: number
  bottom: number
}

interface UseMarqueeSelectionParams {
  elements: Element[]
  viewportOffset: Point
  viewportScale: number
  stageRef: RefObject<HTMLDivElement | null>
  stopTextEditing: () => void
  selectElements: (ids: string[]) => void
  clearCanvasSelection: () => void
}

function getWorldBounds(elementId: string, byId: Map<string, Element>) {
  let current = byId.get(elementId)
  let left = Number(current?.styles.left ?? 0)
  let top = Number(current?.styles.top ?? 0)

  while (current?.parentId) {
    current = byId.get(current.parentId)
    if (!current) break
    left += Number(current.styles.left ?? 0)
    top += Number(current.styles.top ?? 0)
  }

  return { left, top }
}

function resolveElementBox(element: Element) {
  const widthRaw = Number(element.styles.width ?? (element.type === 'text' ? 120 : 100))
  const heightRaw = Number(element.styles.height ?? (element.type === 'text' ? 32 : element.type === 'line' ? 3 : 100))
  const width = Number.isFinite(widthRaw) ? widthRaw : (element.type === 'text' ? 120 : 100)
  const height = Number.isFinite(heightRaw) ? heightRaw : (element.type === 'text' ? 32 : element.type === 'line' ? 3 : 100)
  return { width, height }
}

export function useMarqueeSelection({
  elements,
  viewportOffset,
  viewportScale,
  stageRef,
  stopTextEditing,
  selectElements,
  clearCanvasSelection,
}: UseMarqueeSelectionParams) {
  const [marquee, setMarquee] = useState<MarqueeState | null>(null)
  const marqueeRafRef = useRef<number | null>(null)
  const latestPointerRef = useRef<Point | null>(null)
  const liveSelectionKeyRef = useRef('')

  const selectableRects = useMemo<SelectableRect[]>(() => {
    const byId = new Map(elements.map((element) => [element.id, element]))
    return elements
      .filter((element) => !element.hidden)
      .map((element) => {
        const world = getWorldBounds(element.id, byId)
        const { width, height } = resolveElementBox(element)
        return {
          id: element.id,
          left: world.left,
          top: world.top,
          right: world.left + width,
          bottom: world.top + height,
        }
      })
  }, [elements])

  const resolveMarqueeSelection = (startX: number, startY: number, currentX: number, currentY: number) => {
    const left = Math.min(startX, currentX)
    const top = Math.min(startY, currentY)
    const right = Math.max(startX, currentX)
    const bottom = Math.max(startY, currentY)

    if (Math.abs(right - left) < 2 && Math.abs(bottom - top) < 2) {
      return null
    }

    const selected: string[] = []
    for (const rect of selectableRects) {
      if (!(rect.right < left || rect.left > right || rect.bottom < top || rect.top > bottom)) {
        selected.push(rect.id)
      }
    }
    return selected
  }

  useEffect(() => {
    if (!marquee) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const stage = stageRef.current
      if (!stage) {
        return
      }

      const bounds = stage.getBoundingClientRect()
      const x = Math.max(0, (e.clientX - bounds.left - viewportOffset.x) / viewportScale)
      const y = Math.max(0, (e.clientY - bounds.top - viewportOffset.y) / viewportScale)

      latestPointerRef.current = { x, y }
      if (marqueeRafRef.current != null) {
        return
      }

      marqueeRafRef.current = window.requestAnimationFrame(() => {
        marqueeRafRef.current = null
        const pointer = latestPointerRef.current
        if (!pointer) {
          return
        }

        setMarquee((prev) => {
          if (!prev) {
            return prev
          }

          const next = { ...prev, currentX: pointer.x, currentY: pointer.y }
          const selected = resolveMarqueeSelection(next.startX, next.startY, next.currentX, next.currentY) ?? []
          const key = selected.join('|')
          if (key !== liveSelectionKeyRef.current) {
            liveSelectionKeyRef.current = key
            if (selected.length > 0) {
              stopTextEditing()
            }
            selectElements(selected)
          }

          return next
        })
      })
    }

    const handleMouseUp = () => {
      setMarquee((prev) => {
        if (!prev) {
          return prev
        }

        const selected = resolveMarqueeSelection(prev.startX, prev.startY, prev.currentX, prev.currentY)
        if (!selected) {
          clearCanvasSelection()
          liveSelectionKeyRef.current = ''
          if (marqueeRafRef.current != null) {
            window.cancelAnimationFrame(marqueeRafRef.current)
            marqueeRafRef.current = null
          }
          latestPointerRef.current = null
          return null
        }

        stopTextEditing()
        selectElements(selected)
        liveSelectionKeyRef.current = selected.join('|')
        if (marqueeRafRef.current != null) {
          window.cancelAnimationFrame(marqueeRafRef.current)
          marqueeRafRef.current = null
        }
        latestPointerRef.current = null
        return null
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      latestPointerRef.current = null
      if (marqueeRafRef.current != null) {
        window.cancelAnimationFrame(marqueeRafRef.current)
        marqueeRafRef.current = null
      }
    }
  }, [marquee, selectableRects, viewportOffset.x, viewportOffset.y, viewportScale, stageRef, clearCanvasSelection, selectElements, stopTextEditing])

  const marqueeStyle = useMemo(() => {
    if (!marquee) {
      return null
    }

    const left = Math.min(marquee.startX, marquee.currentX)
    const top = Math.min(marquee.startY, marquee.currentY)
    const width = Math.abs(marquee.currentX - marquee.startX)
    const height = Math.abs(marquee.currentY - marquee.startY)

    return {
      left,
      top,
      width,
      height,
    }
  }, [marquee])

  const startMarquee = (startX: number, startY: number) => {
    setMarquee({ startX, startY, currentX: startX, currentY: startY })
  }

  return {
    marqueeStyle,
    startMarquee,
  }
}
