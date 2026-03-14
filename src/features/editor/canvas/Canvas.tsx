import { ElementRenderer } from './ElementRenderer'
import { useEditorCommands, useEditorData } from '../state/EditorContext'

export function Canvas() {
  const { elements, selectedId } = useEditorData()
  const { clearSelection } = useEditorCommands()

  return (
    <div
      className="flex-1 relative bg-gray-100"
      onClick={clearSelection}
    >
      {elements.map(element => (
        <ElementRenderer
          key={element.id}
          element={element}
          isSelected={selectedId === element.id}
        />
      ))}
    </div>
  )
}