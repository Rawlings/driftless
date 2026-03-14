import type { Element } from '../../../core/editor/types'
import { useEditorInteractions } from '../state/EditorContext'

interface ElementRendererProps {
  element: Element
  isSelected: boolean
}

export function ElementRenderer({
  element,
  isSelected
}: ElementRendererProps) {
  const { handleMouseDown, handleResizeMouseDown } = useEditorInteractions()

  return (
    <div
      onMouseDown={(e) => handleMouseDown(e, element.id)}
      onClick={(e) => e.stopPropagation()}
      style={element.styles}
    >
      {isSelected && (
        <div
          onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
        />
      )}
    </div>
  )
}