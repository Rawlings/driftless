import { Toolbar } from './Toolbar'
import { Canvas } from '../canvas/Canvas'
import { PropertiesPanel } from '../properties/PropertiesPanel'
import { EditorProvider } from '../state/EditorContext'

export function EditorWorkspace() {
  return (
    <EditorProvider>
      <div className="relative h-screen w-full overflow-hidden">
        <Canvas />
        <PropertiesPanel />
        <Toolbar />
      </div>
    </EditorProvider>
  )
}
