export type EditorToolId = 'move' | 'hand' | 'square' | 'circle' | 'line' | 'text'

export interface EditorTool {
  id: EditorToolId
  label: string
  shortcut: string
  family: 'navigation' | 'shape' | 'content'
}

export const EDITOR_TOOLS: EditorTool[] = [
  { id: 'move', label: 'Move', shortcut: 'V', family: 'navigation' },
  { id: 'hand', label: 'Hand', shortcut: 'H', family: 'navigation' },
  { id: 'square', label: 'Rectangle', shortcut: 'R', family: 'shape' },
  { id: 'circle', label: 'Ellipse', shortcut: 'O', family: 'shape' },
  { id: 'line', label: 'Line', shortcut: 'L', family: 'shape' },
  { id: 'text', label: 'Text', shortcut: 'T', family: 'content' }
]

export function isShapeTool(tool: EditorToolId): tool is 'square' | 'circle' | 'line' {
  return tool === 'square' || tool === 'circle' || tool === 'line'
}

export function isTextTool(tool: EditorToolId): tool is 'text' {
  return tool === 'text'
}