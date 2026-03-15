import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { EditorToolId } from '../../../core/tools'
import type { SnapGuide } from '../../canvas'

interface ViewportOffset {
  x: number
  y: number
}

interface EditorUiState {
  activeTool: EditorToolId
  viewportOffset: ViewportOffset
  viewportScale: number
  editingTextId: string | null
  snapGuides: SnapGuide[]
  setActiveTool: (tool: EditorToolId) => void
  setViewportOffset: (offset: ViewportOffset) => void
  setViewportScale: (scale: number) => void
  setEditingTextId: (id: string | null) => void
  setSnapGuides: (guides: SnapGuide[]) => void
}

export const useEditorUiStore = create<EditorUiState>()(
  immer((set) => ({
    activeTool: 'move',
    viewportOffset: { x: 0, y: 0 },
    viewportScale: 1,
    editingTextId: null,
    snapGuides: [],
    setActiveTool: (tool) => {
      set((state) => {
        state.activeTool = tool
      })
    },
    setViewportOffset: (offset) => {
      set((state) => {
        state.viewportOffset = offset
      })
    },
    setViewportScale: (scale) => {
      set((state) => {
        state.viewportScale = scale
      })
    },
    setEditingTextId: (id) => {
      set((state) => {
        state.editingTextId = id
      })
    },
    setSnapGuides: (guides) => {
      set((state) => {
        state.snapGuides = guides
      })
    },
  }))
)