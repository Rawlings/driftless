import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronRight, Circle, Minus, Slash, Square, Type } from 'lucide-react'
import type { Element } from '../../../core/editor/types'
import { useEditorCommands, useEditorData } from '../state/EditorContext'
import { cn, uiTokens } from '../ui/tokens'

function getLayerLabel(element: Element, index: number) {
  if (element.type === 'text') {
    const text = String(element.styles.text ?? '').trim()
    return text.length > 0 ? text : `Text ${index + 1}`
  }

  const name = element.type === 'square'
    ? 'Rectangle'
    : element.type === 'circle'
      ? 'Ellipse'
      : 'Line'

  return `${name} ${index + 1}`
}

function getLayerIcon(type: Element['type']) {
  if (type === 'square') {
    return <Square className="h-4 w-4" aria-hidden="true" />
  }
  if (type === 'circle') {
    return <Circle className="h-4 w-4" aria-hidden="true" />
  }
  if (type === 'line') {
    return <Slash className="h-4 w-4" aria-hidden="true" />
  }
  return <Type className="h-4 w-4" aria-hidden="true" />
}

export function LayersPanel() {
  const { elements, selectedId } = useEditorData()
  const { selectElement, moveElementLayer, setElementParentAt } = useEditorCommands()

  const [isMinimized, setIsMinimized] = useState(false)
  const [width, setWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [search, setSearch] = useState('')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{ mode: 'root' | 'inside' | 'before' | 'after'; targetId?: string } | null>(null)

  const treeItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    const byId = new Map(elements.map((element) => [element.id, element]))
    const childMap = new Map<string | null, Element[]>()

    elements.forEach((element) => {
      const key = element.parentId ?? null
      const list = childMap.get(key)
      if (list) {
        list.push(element)
      } else {
        childMap.set(key, [element])
      }
    })

    const result: Array<{ element: Element; label: string; depth: number; parentId: string | null }> = []

    const walk = (parentId: string | null, depth: number) => {
      const children = [...(childMap.get(parentId) ?? [])].reverse()
      children.forEach((element) => {
        const index = elements.findIndex((item) => item.id === element.id)
        const label = getLayerLabel(element, Math.max(0, index))

        if (query.length === 0 || label.toLowerCase().includes(query) || element.type.toLowerCase().includes(query)) {
          result.push({ element, label, depth, parentId })
        }

        walk(element.id, depth + 1)
      })
    }

    // Only roots are walk entrypoints; this naturally shows hierarchy indentation.
    walk(null, 0)

    // Remove invalid parent pointers in view-only projection to avoid orphan confusion.
    return result.filter((item) => !item.element.parentId || byId.has(item.element.parentId))
  }, [elements, search])

  const siblingsTopFirstByParent = useMemo(() => {
    const map = new Map<string | null, string[]>()
    elements.forEach((element) => {
      const key = element.parentId ?? null
      const list = map.get(key)
      if (list) {
        list.push(element.id)
      } else {
        map.set(key, [element.id])
      }
    })

    const topFirst = new Map<string | null, string[]>()
    map.forEach((list, key) => {
      topFirst.set(key, [...list].reverse())
    })
    return topFirst
  }, [elements])

  const applyDrop = (target: { mode: 'root' | 'inside' | 'before' | 'after'; targetId?: string }) => {
    if (!draggingId) {
      return
    }

    if (target.mode === 'root') {
      const rootSiblings = siblingsTopFirstByParent.get(null) ?? []
      setElementParentAt(draggingId, null, rootSiblings.length)
      return
    }

    if (!target.targetId) {
      return
    }

    const targetItem = treeItems.find((item) => item.element.id === target.targetId)
    if (!targetItem) {
      return
    }

    if (target.mode === 'inside') {
      const childSiblings = siblingsTopFirstByParent.get(target.targetId) ?? []
      setElementParentAt(draggingId, target.targetId, childSiblings.length)
      return
    }

    const parentId = targetItem.parentId
    const siblingIds = siblingsTopFirstByParent.get(parentId) ?? []
    const targetIndex = siblingIds.indexOf(target.targetId)
    if (targetIndex < 0) {
      return
    }

    const insertIndex = target.mode === 'before' ? targetIndex : targetIndex + 1
    setElementParentAt(draggingId, parentId, insertIndex)
  }

  if (isMinimized) {
    return (
      <button
        type="button"
        aria-label="Expand layers panel"
        title="Expand layers panel"
        className={cn(
          'fixed left-4 top-1/2 z-40 -translate-y-1/2 rounded-r-xl px-2 py-3',
          uiTokens.control.iconButton,
          uiTokens.motion.control,
          uiTokens.control.iconButtonHover,
          uiTokens.control.iconButtonActive,
          uiTokens.focus.ring,
          'border-slate-300 bg-white shadow'
        )}
        onClick={() => setIsMinimized(false)}
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    )
  }

  return (
    <aside
      className={cn('fixed left-4 top-4 bottom-4 z-30', uiTokens.shell.panel, uiTokens.motion.panel)}
      style={{ width }}
    >
      <div
        className="absolute right-0 top-0 h-full w-2 translate-x-1/2 cursor-col-resize"
        onMouseDown={() => setIsResizing(true)}
      />

      {isResizing && (
        <div
          className="fixed inset-0 z-50"
          onMouseMove={(e) => {
            const nextWidth = e.clientX - 16
            setWidth(Math.min(560, Math.max(280, nextWidth)))
          }}
          onMouseUp={() => setIsResizing(false)}
        />
      )}

      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className={uiTokens.text.heading}>Layers</h3>
          <button
            type="button"
            aria-label="Minimize layers panel"
            title="Minimize layers panel"
            className={cn(
              uiTokens.control.iconButton,
              uiTokens.motion.control,
              uiTokens.control.iconButtonHover,
              uiTokens.control.iconButtonActive,
              uiTokens.focus.ring,
              'p-1.5'
            )}
            onClick={() => setIsMinimized(true)}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search layers"
            className={cn('mb-3', uiTokens.input.base, uiTokens.motion.control, uiTokens.input.hover, uiTokens.focus.ringSoft)}
          />

          <div className="rounded-lg border border-slate-200">
            <div
              className={`border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 ${dropTarget?.mode === 'root' ? 'ring-2 ring-inset ring-blue-500/70' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDropTarget({ mode: 'root' })
              }}
              onDrop={(e) => {
                e.preventDefault()
                applyDrop({ mode: 'root' })
                setDraggingId(null)
                setDropTarget(null)
              }}
            >
              Canvas
            </div>

            <div
              className="divide-y divide-slate-100"
              onDragOver={(e) => e.preventDefault()}
            >
              {treeItems.length === 0 ? (
                <p className="px-3 py-3 text-sm text-slate-500">No layers</p>
              ) : (
                treeItems.map(({ element, label, depth }) => {
                  const isSelected = element.id === selectedId
                  const isDragging = draggingId === element.id

                  return (
                    <div key={element.id}>
                      <div
                        className={`mx-2 h-1 rounded ${dropTarget?.mode === 'before' && dropTarget.targetId === element.id ? 'bg-blue-500' : 'bg-transparent'}`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDropTarget({ mode: 'before', targetId: element.id })
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          applyDrop({ mode: 'before', targetId: element.id })
                          setDraggingId(null)
                          setDropTarget(null)
                        }}
                      />

                      <div
                        draggable
                        onDragStart={(e) => {
                          setDraggingId(element.id)
                          e.dataTransfer.effectAllowed = 'move'
                          e.dataTransfer.setData('text/plain', element.id)
                        }}
                        onDragEnd={() => {
                          setDraggingId(null)
                          setDropTarget(null)
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDropTarget({ mode: 'inside', targetId: element.id })
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          applyDrop({ mode: 'inside', targetId: element.id })
                          setDraggingId(null)
                          setDropTarget(null)
                        }}
                        className={`group flex items-center gap-2 px-2.5 py-2 transition-colors duration-150 ease-out ${isSelected ? 'bg-blue-100' : 'hover:bg-slate-100'} ${isDragging ? 'opacity-40' : ''} ${dropTarget?.mode === 'inside' && dropTarget.targetId === element.id ? 'ring-2 ring-inset ring-blue-500/70' : ''}`}
                        style={{ paddingLeft: `${10 + depth * 16}px` }}
                      >
                        <button
                          type="button"
                          className={cn('flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left outline-none', uiTokens.focus.ring)}
                          onClick={() => selectElement(element.id)}
                        >
                          <span className={`inline-flex h-5 w-5 items-center justify-center ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>
                            {getLayerIcon(element.type)}
                          </span>
                          <span className={`truncate text-sm ${isSelected ? 'font-semibold text-blue-900' : 'text-slate-800'}`}>{label}</span>
                        </button>

                        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100">
                          <button
                            type="button"
                            className={cn(uiTokens.control.iconButton, uiTokens.motion.control, uiTokens.control.iconButtonHover, uiTokens.focus.ring, 'px-1.5 py-0.5 text-xs text-slate-600')}
                            title="Send backward"
                            onClick={() => moveElementLayer(element.id, 'down')}
                          >
                            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className={cn(uiTokens.control.iconButton, uiTokens.motion.control, uiTokens.control.iconButtonHover, uiTokens.focus.ring, 'px-1.5 py-0.5 text-xs text-slate-600')}
                            title="Bring forward"
                            onClick={() => moveElementLayer(element.id, 'up')}
                          >
                            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div
                        className={`mx-2 h-1 rounded ${dropTarget?.mode === 'after' && dropTarget.targetId === element.id ? 'bg-blue-500' : 'bg-transparent'}`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDropTarget({ mode: 'after', targetId: element.id })
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          applyDrop({ mode: 'after', targetId: element.id })
                          setDraggingId(null)
                          setDropTarget(null)
                        }}
                      />
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
