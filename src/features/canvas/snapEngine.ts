import type { SnapGuide } from './canvasTypes'

export interface SnapRect {
  id: string
  left: number
  top: number
  width: number
  height: number
  parentId?: string | null
}

export interface SnapResult {
  x: number
  y: number
  guides: SnapGuide[]
}

export interface SnapGuideLookup {
  xGuides: number[]
  yGuides: number[]
}

const SNAP_THRESHOLD = 12

function lowerBound(sorted: number[], target: number): number {
  let low = 0
  let high = sorted.length

  while (low < high) {
    const mid = (low + high) >> 1
    if (sorted[mid] < target) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  return low
}

function findNearestGuide(sorted: number[], edge: number, threshold: number): { delta: number; guidePos: number } | null {
  if (sorted.length === 0) {
    return null
  }

  const index = lowerBound(sorted, edge)
  let best: { delta: number; guidePos: number } | null = null

  const consider = (pos: number | undefined) => {
    if (pos === undefined) {
      return
    }

    const delta = pos - edge
    if (Math.abs(delta) >= threshold) {
      return
    }

    if (!best || Math.abs(delta) < Math.abs(best.delta)) {
      best = { delta, guidePos: pos }
    }
  }

  consider(sorted[index - 1])
  consider(sorted[index])

  return best
}

export function createSnapGuideLookup(others: SnapRect[]): SnapGuideLookup {
  const xGuides: number[] = []
  const yGuides: number[] = []

  for (const other of others) {
    xGuides.push(other.left, other.left + other.width / 2, other.left + other.width)
    yGuides.push(other.top, other.top + other.height / 2, other.top + other.height)
  }

  xGuides.sort((a, b) => a - b)
  yGuides.sort((a, b) => a - b)

  return { xGuides, yGuides }
}

export function computeSnapFromLookup(
  dragging: { x: number; y: number; width: number; height: number },
  lookup: SnapGuideLookup,
  threshold = SNAP_THRESHOLD
): SnapResult {
  const dEdgesX = [dragging.x, dragging.x + dragging.width / 2, dragging.x + dragging.width]
  const dEdgesY = [dragging.y, dragging.y + dragging.height / 2, dragging.y + dragging.height]

  let bestX: { delta: number; guidePos: number } | null = null
  let bestY: { delta: number; guidePos: number } | null = null

  for (const dEdge of dEdgesX) {
    const nearest = findNearestGuide(lookup.xGuides, dEdge, threshold)
    if (nearest && (!bestX || Math.abs(nearest.delta) < Math.abs(bestX.delta))) {
      bestX = nearest
    }
  }

  for (const dEdge of dEdgesY) {
    const nearest = findNearestGuide(lookup.yGuides, dEdge, threshold)
    if (nearest && (!bestY || Math.abs(nearest.delta) < Math.abs(bestY.delta))) {
      bestY = nearest
    }
  }

  const guides: SnapGuide[] = []
  if (bestX) guides.push({ type: 'v', position: bestX.guidePos })
  if (bestY) guides.push({ type: 'h', position: bestY.guidePos })

  return {
    x: bestX ? dragging.x + bestX.delta : dragging.x,
    y: bestY ? dragging.y + bestY.delta : dragging.y,
    guides
  }
}

function intervalGap(aMin: number, aMax: number, bMin: number, bMax: number): number {
  if (aMax < bMin) {
    return bMin - aMax
  }
  if (bMax < aMin) {
    return aMin - bMax
  }
  return 0
}

export function computeSnap(
  dragging: { x: number; y: number; width: number; height: number; id: string; parentId?: string | null },
  others: SnapRect[],
  threshold = SNAP_THRESHOLD
): SnapResult {
  // Only consider elements in the same scope (same parent)
  const candidates = others.filter(
    (o) => o.id !== dragging.id && (o.parentId ?? null) === (dragging.parentId ?? null)
  )

  const dEdgesX = [dragging.x, dragging.x + dragging.width / 2, dragging.x + dragging.width]
  const dEdgesY = [dragging.y, dragging.y + dragging.height / 2, dragging.y + dragging.height]
  const draggingLeft = dragging.x
  const draggingRight = dragging.x + dragging.width
  const draggingTop = dragging.y
  const draggingBottom = dragging.y + dragging.height

  let bestX: { delta: number; guidePos: number } | null = null
  let bestY: { delta: number; guidePos: number } | null = null

  for (const other of candidates) {
    const otherLeft = other.left
    const otherRight = other.left + other.width
    const otherTop = other.top
    const otherBottom = other.top + other.height
    const xGap = intervalGap(draggingLeft, draggingRight, otherLeft, otherRight)
    const yGap = intervalGap(draggingTop, draggingBottom, otherTop, otherBottom)

    const oEdgesX = [other.left, other.left + other.width / 2, other.left + other.width]
    const oEdgesY = [other.top, other.top + other.height / 2, other.top + other.height]

    if (xGap <= threshold) {
      for (const dEdge of dEdgesX) {
        for (const oEdge of oEdgesX) {
          const delta = oEdge - dEdge
          if (Math.abs(delta) < threshold && (!bestX || Math.abs(delta) < Math.abs(bestX.delta))) {
            bestX = { delta, guidePos: oEdge }
          }
        }
      }
    }

    if (yGap <= threshold) {
      for (const dEdge of dEdgesY) {
        for (const oEdge of oEdgesY) {
          const delta = oEdge - dEdge
          if (Math.abs(delta) < threshold && (!bestY || Math.abs(delta) < Math.abs(bestY.delta))) {
            bestY = { delta, guidePos: oEdge }
          }
        }
      }
    }
  }

  const guides: SnapGuide[] = []
  if (bestX) guides.push({ type: 'v', position: bestX.guidePos })
  if (bestY) guides.push({ type: 'h', position: bestY.guidePos })

  return {
    x: bestX ? dragging.x + bestX.delta : dragging.x,
    y: bestY ? dragging.y + bestY.delta : dragging.y,
    guides
  }
}
