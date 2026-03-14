import { Toolbar } from './editor/Toolbar'
import { Canvas } from './editor/Canvas'
import { PropertiesPanel } from './editor/PropertiesPanel'
import { useEditorState } from './editor/useEditorState'
import { useInteractions } from './editor/useInteractions'

function Editor() {
  const {
    elements,
    selectedId,
    selectedElement,
    setSelectedId,
    addElement,
    updateElement
  } = useEditorState()

  const { isDragging, handleMouseDown, handleResizeMouseDown } = useInteractions({
    selectedId,
    elements,
    updateElement
  })

  const handleCanvasClick = () => {
    setSelectedId(null)
  }

  return (
    <div className="flex h-screen">
      <Toolbar onAddElement={addElement} />
      <Canvas
        elements={elements}
        selectedId={selectedId}
        isDragging={isDragging}
        onMouseDown={handleMouseDown}
        onResizeMouseDown={handleResizeMouseDown}
        onCanvasClick={handleCanvasClick}
      />
      <PropertiesPanel
        selectedElement={selectedElement}
        onUpdateElement={updateElement}
      />
    </div>
  )
}

export default Editor