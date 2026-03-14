import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Element } from '../../../core/editor/types'
import type { EditorToolId } from '../../../core/editor/tools'
import { useEditorState } from '../../../hooks/editor/useEditorState'

interface EditorDataContextValue {
  elements: Element[]
  selectedId: string | null
  selectedElement: Element | null
  activeTool: EditorToolId
  viewportOffset: { x: number; y: number }
  editingTextId: string | null
}

interface EditorCommandsContextValue {
  addElement: (type: Element['type'], position?: { left: number; top: number }) => string
  updateElement: (id: string, updates: Partial<Element>) => void
  moveElementLayer: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void
  reorderElements: (orderedIds: string[]) => void
  setElementParent: (id: string, parentId: string | null) => void
  setElementParentAt: (id: string, parentId: string | null, insertIndexTopFirst: number) => void
  selectElement: (id: string | null) => void
  clearSelection: () => void
  setActiveTool: (tool: EditorToolId) => void
  setViewportOffset: (offset: { x: number; y: number }) => void
  setEditingTextId: (id: string | null) => void
}

const EditorDataContext = createContext<EditorDataContextValue | null>(null)
const EditorCommandsContext = createContext<EditorCommandsContextValue | null>(null)

export function EditorProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<EditorToolId>('move')
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 })
  const [editingTextId, setEditingTextId] = useState<string | null>(null)

  const {
    elements,
    selectedId,
    selectedElement,
    setSelectedId,
    addElement,
    updateElement,
    moveElementLayer,
    reorderElements,
    setElementParent,
    setElementParentAt
  } = useEditorState()

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [setSelectedId])

  const clearSelection = useCallback(() => {
    setSelectedId(null)
  }, [setSelectedId])

  const dataValue = useMemo<EditorDataContextValue>(() => ({
    elements,
    selectedId,
    selectedElement,
    activeTool,
    viewportOffset,
    editingTextId
  }), [elements, selectedId, selectedElement, activeTool, viewportOffset, editingTextId])

  const commandsValue = useMemo<EditorCommandsContextValue>(() => ({
    addElement,
    updateElement,
    moveElementLayer,
    reorderElements,
    setElementParent,
    setElementParentAt,
    selectElement,
    clearSelection,
    setActiveTool,
    setViewportOffset,
    setEditingTextId
  }), [addElement, updateElement, moveElementLayer, reorderElements, setElementParent, setElementParentAt, selectElement, clearSelection, setActiveTool, setViewportOffset, setEditingTextId])

  return (
    <EditorDataContext.Provider value={dataValue}>
      <EditorCommandsContext.Provider value={commandsValue}>
        {children}
      </EditorCommandsContext.Provider>
    </EditorDataContext.Provider>
  )
}

export function useEditorData() {
  const context = useContext(EditorDataContext)
  if (!context) {
    throw new Error('useEditorData must be used within EditorProvider')
  }
  return context
}

export function useEditorCommands() {
  const context = useContext(EditorCommandsContext)
  if (!context) {
    throw new Error('useEditorCommands must be used within EditorProvider')
  }
  return context
}
