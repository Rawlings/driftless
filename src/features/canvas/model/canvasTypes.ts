export interface CreatingShapeState {
  type: 'square' | 'circle' | 'line'
  startX: number
  startY: number
  currentX: number
  currentY: number
  stageLeft: number
  stageTop: number
  moved: boolean
}

export interface CreatingTextState {
  id: string
  startX: number
  startY: number
  stageLeft: number
  stageTop: number
  moved: boolean
}

export interface Point {
  x: number
  y: number
}

export interface SnapGuide {
  type: 'h' | 'v'
  position: number
}
