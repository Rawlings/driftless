import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import type { Element } from '../../../core/types'
import type { EditorToolId } from '../../../core/tools'
import type { SnapGuide } from '../../canvas'
import { useEditorState } from '../model'
import { useEditorUiStore } from '../store'

interface EditorDataContextValue {
  elements: Element[]
  selectedIds: string[]
  selectedId: string | null
  selectedElement: Element | null
  activeTool: EditorToolId
  viewportOffset: { x: number; y: number }
  viewportScale: number
  editingTextId: string | null
  snapGuides: SnapGuide[]
}

interface EditorCommandsContextValue {
  addElement: (
    type: Element['type'],
    position?: { left: number; top: number },
    styleOverrides?: Partial<Element['styles']>
  ) => string
  updateElement: (id: string, updates: Partial<Element>) => void
  moveElementLayer: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void
  reorderElements: (orderedIds: string[]) => void
  setElementParent: (id: string, parentId: string | null) => void
  setElementParentAt: (id: string, parentId: string | null, insertIndexTopFirst: number) => void
  deleteSelectedElement: () => void
  duplicateSelectedElement: () => void
  toggleSelectedLock: () => void
  toggleSelectedVisibility: () => void
  selectElement: (id: string | null) => void
  selectElements: (ids: string[]) => void
  clearSelection: () => void
  setActiveTool: (tool: EditorToolId) => void
  setViewportOffset: (offset: { x: number; y: number }) => void
  setViewportScale: (scale: number) => void
  setEditingTextId: (id: string | null) => void
  setSnapGuides: (guides: SnapGuide[]) => void
}

const EditorDataContext = createContext<EditorDataContextValue | null>(null)
const EditorCommandsContext = createContext<EditorCommandsContextValue | null>(null)

export function EditorProvider({ children }: { children: ReactNode }) {
  const activeTool = useEditorUiStore((state) => state.activeTool)
  const viewportOffset = useEditorUiStore((state) => state.viewportOffset)
  const viewportScale = useEditorUiStore((state) => state.viewportScale)
  const editingTextId = useEditorUiStore((state) => state.editingTextId)
  const snapGuides = useEditorUiStore((state) => state.snapGuides)
  const setActiveTool = useEditorUiStore((state) => state.setActiveTool)
  const setViewportOffset = useEditorUiStore((state) => state.setViewportOffset)
  const setViewportScale = useEditorUiStore((state) => state.setViewportScale)
  const setEditingTextId = useEditorUiStore((state) => state.setEditingTextId)
  const setSnapGuides = useEditorUiStore((state) => state.setSnapGuides)

  const {
    elements,
    selectedIds,
    selectedId,
    selectedElement,
    setSelectedId,
    setSelectedIds,
    addElement,
    updateElement,
    moveElementLayer,
    reorderElements,
    setElementParent,
    setElementParentAt,
    deleteSelectedElement,
    duplicateSelectedElement,
    toggleSelectedLock,
    toggleSelectedVisibility
  } = useEditorState()

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [setSelectedId])

  const clearSelection = useCallback(() => {
    setSelectedId(null)
  }, [setSelectedId])

  const selectElements = useCallback((ids: string[]) => {
    setSelectedIds(ids)
  }, [setSelectedIds])

  const dataValue = useMemo<EditorDataContextValue>(() => ({
    elements,
    selectedIds,
    selectedId,
    selectedElement,
    activeTool,
    viewportOffset,
    viewportScale,
    editingTextId,
    snapGuides
  }), [elements, selectedIds, selectedId, selectedElement, activeTool, viewportOffset, viewportScale, editingTextId, snapGuides])

  const commandsValue = useMemo<EditorCommandsContextValue>(() => ({
    addElement,
    updateElement,
    moveElementLayer,
    reorderElements,
    setElementParent,
    setElementParentAt,
    deleteSelectedElement,
    duplicateSelectedElement,
    toggleSelectedLock,
    toggleSelectedVisibility,
    selectElement,
    selectElements,
    clearSelection,
    setActiveTool,
    setViewportOffset,
    setViewportScale,
    setEditingTextId,
    setSnapGuides
  }), [addElement, updateElement, moveElementLayer, reorderElements, setElementParent, setElementParentAt, deleteSelectedElement, duplicateSelectedElement, toggleSelectedLock, toggleSelectedVisibility, selectElement, selectElements, clearSelection, setActiveTool, setViewportOffset, setViewportScale, setEditingTextId, setSnapGuides])

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
