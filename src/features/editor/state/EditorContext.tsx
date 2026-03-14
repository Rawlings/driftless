import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import type { Element } from '../../../core/editor/types'
import { useEditorState } from '../../../hooks/editor/useEditorState'
import { useInteractions } from '../../../hooks/editor/useInteractions'

interface EditorDataContextValue {
  elements: Element[]
  selectedId: string | null
  selectedElement: Element | null
}

interface EditorCommandsContextValue {
  addElement: (type: Element['type']) => void
  updateElement: (id: string, updates: Partial<Element>) => void
  clearSelection: () => void
}

interface EditorInteractionsContextValue {
  handleMouseDown: (e: React.MouseEvent, id: string) => void
  handleResizeMouseDown: (e: React.MouseEvent, id: string) => void
}

const EditorDataContext = createContext<EditorDataContextValue | null>(null)
const EditorCommandsContext = createContext<EditorCommandsContextValue | null>(null)
const EditorInteractionsContext = createContext<EditorInteractionsContextValue | null>(null)

export function EditorProvider({ children }: { children: ReactNode }) {
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
    selectedElement
  }), [elements, selectedId, selectedElement])

  const commandsValue = useMemo<EditorCommandsContextValue>(() => ({
    addElement,
    updateElement,
    clearSelection
  }), [addElement, updateElement, clearSelection])

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
