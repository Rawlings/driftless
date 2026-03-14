import { Toolbar } from './Toolbar'
import { Canvas } from '../canvas/Canvas'
import { PropertiesPanel } from '../properties/PropertiesPanel'
import { LayersPanel } from '../layers/LayersPanel'
import { EditorProvider } from '../state/EditorContext'

export function EditorWorkspace() {
  return (
    <EditorProvider>
      <div className="relative h-screen w-full overflow-hidden">
        <Canvas />
        <LayersPanel />
        <PropertiesPanel />
        <Toolbar />
      </div>
    </EditorProvider>
  )
}
