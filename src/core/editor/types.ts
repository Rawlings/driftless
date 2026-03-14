export interface Element {
  id: string
  type: 'line' | 'circle' | 'square' | 'text'
  styles: { [key: string]: any }
}

export interface DragState {
  isDragging: boolean
  dragOffset: { x: number; y: number }
}

export interface ResizeState {
  isResizing: boolean
  resizeStart: { x: number; y: number; width: number; height: number }
}