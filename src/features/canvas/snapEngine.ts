export interface SnapRect {
  id: string
  left: number
  top: number
  width: number
  height: number
  parentId?: string | null
}

export interface SnapGuide {
  type: 'h' | 'v'
  position: number
}

export interface SnapResult {
  x: number
  y: number
  guides: SnapGuide[]
}

const SNAP_THRESHOLD = 12

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

  let bestX: { delta: number; guidePos: number } | null = null
  let bestY: { delta: number; guidePos: number } | null = null

  for (const other of candidates) {
    const oEdgesX = [other.left, other.left + other.width / 2, other.left + other.width]
    const oEdgesY = [other.top, other.top + other.height / 2, other.top + other.height]

    for (const dEdge of dEdgesX) {
      for (const oEdge of oEdgesX) {
        const delta = oEdge - dEdge
        if (Math.abs(delta) < threshold && (!bestX || Math.abs(delta) < Math.abs(bestX.delta))) {
          bestX = { delta, guidePos: oEdge }
        }
      }
    }

    for (const dEdge of dEdgesY) {
      for (const oEdge of oEdgesY) {
        const delta = oEdge - dEdge
        if (Math.abs(delta) < threshold && (!bestY || Math.abs(delta) < Math.abs(bestY.delta))) {
          bestY = { delta, guidePos: oEdge }
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
