export type EditorToolId = 'move' | 'hand' | 'square' | 'circle' | 'line' | 'text'

export interface EditorTool {
  id: EditorToolId
  label: string
  family: 'navigation' | 'shape' | 'content'
}

export const EDITOR_TOOLS: EditorTool[] = [
  { id: 'move', label: 'Move', family: 'navigation' },
  { id: 'hand', label: 'Hand', family: 'navigation' },
  { id: 'square', label: 'Rectangle', family: 'shape' },
  { id: 'circle', label: 'Ellipse', family: 'shape' },
  { id: 'line', label: 'Line', family: 'shape' },
  { id: 'text', label: 'Text', family: 'content' }
]

export function isShapeTool(tool: EditorToolId): tool is 'square' | 'circle' | 'line' {
  return tool === 'square' || tool === 'circle' || tool === 'line'
}

export function isTextTool(tool: EditorToolId): tool is 'text' {
  return tool === 'text'
}