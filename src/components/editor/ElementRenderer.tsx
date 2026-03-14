import type { Element } from './types'

interface ElementRendererProps {
  element: Element
  isSelected: boolean
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent, id: string) => void
  onResizeMouseDown: (e: React.MouseEvent, id: string) => void
}

export function ElementRenderer({
  element,
  isSelected,
  isDragging,
  onMouseDown,
  onResizeMouseDown
}: ElementRendererProps) {
  return (
    <div
      onMouseDown={(e) => onMouseDown(e, element.id)}
      style={{
        position: 'absolute',
        left: element.styles.x,
        top: element.styles.y,
        width: element.styles.width,
        height: element.styles.height,
        backgroundColor: element.styles.backgroundColor,
        border: `${element.styles.borderWidth}px ${element.styles.borderStyle} ${element.styles.borderColor}`,
        borderRadius: element.styles.borderRadius,
        boxShadow: element.styles.boxShadow,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {isSelected && (
        <div
          onMouseDown={(e) => onResizeMouseDown(e, element.id)}
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
        />
      )}
    </div>
  )
}