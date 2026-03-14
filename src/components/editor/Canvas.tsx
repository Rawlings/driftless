import type { Element } from './types'
import { ElementRenderer } from './ElementRenderer'

interface CanvasProps {
  elements: Element[]
  selectedId: string | null
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent, id: string) => void
  onResizeMouseDown: (e: React.MouseEvent, id: string) => void
  onCanvasClick: () => void
}

export function Canvas({
  elements,
  selectedId,
  isDragging,
  onMouseDown,
  onResizeMouseDown,
  onCanvasClick
}: CanvasProps) {
  return (
    <div
      className="flex-1 relative bg-gray-100"
      onClick={onCanvasClick}
    >
      {elements.map(element => (
        <ElementRenderer
          key={element.id}
          element={element}
          isSelected={selectedId === element.id}
          isDragging={isDragging}
          onMouseDown={onMouseDown}
          onResizeMouseDown={onResizeMouseDown}
        />
      ))}
    </div>
  )
}