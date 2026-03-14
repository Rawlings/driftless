import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Element } from '../../../core/editor/types'
import type { EditorToolId } from '../../../core/editor/tools'
import { useEditorState } from '../../../hooks/editor/useEditorState'
import { useInteractions } from '../../../hooks/editor/useInteractions'

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
  clearSelection: () => void
  setActiveTool: (tool: EditorToolId) => void
  setViewportOffset: (offset: { x: number; y: number }) => void
  setEditingTextId: (id: string | null) => void
}

interface EditorInteractionsContextValue {
  handleMouseDown: (e: React.MouseEvent, id: string) => void
  handleResizeMouseDown: (e: React.MouseEvent, id: string) => void
}

const EditorDataContext = createContext<EditorDataContextValue | null>(null)
const EditorCommandsContext = createContext<EditorCommandsContextValue | null>(null)
const EditorInteractionsContext = createContext<EditorInteractionsContextValue | null>(null)

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
    updateElement
  } = useEditorState()

  const { handleMouseDown, handleResizeMouseDown } = useInteractions({
    selectedId,
    activeTool,
    editingTextId,
    viewportOffset,
    elements,
    setSelectedId,
    updateElement
  })

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
    clearSelection,
    setActiveTool,
    setViewportOffset,
    setEditingTextId
  }), [addElement, updateElement, clearSelection, setActiveTool, setViewportOffset, setEditingTextId])

  const interactionsValue = useMemo<EditorInteractionsContextValue>(() => ({
    handleMouseDown,
    handleResizeMouseDown
  }), [handleMouseDown, handleResizeMouseDown])

  return (
    <EditorDataContext.Provider value={dataValue}>
      <EditorCommandsContext.Provider value={commandsValue}>
        <EditorInteractionsContext.Provider value={interactionsValue}>
          {children}
        </EditorInteractionsContext.Provider>
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

export function useEditorInteractions() {
  const context = useContext(EditorInteractionsContext)
  if (!context) {
    throw new Error('useEditorInteractions must be used within EditorProvider')
  }
  return context
}
