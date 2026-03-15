import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Rnd } from 'react-rnd'
import type { Element } from '../../core/types'
import { useEditorCommands, useEditorData } from '../state/EditorContext'
import { computeSnap, type SnapRect } from './snapEngine'

interface DragSnapInput {
  x: number
  y: number
  width: number
  height: number
  id: string
  parentId?: string | null
}

interface ElementRendererProps {
  element: Element
  isSelected: boolean
  children?: ReactNode
}

export function ElementRenderer({
  element,
  isSelected,
  children
}: ElementRendererProps) {
  const { activeTool, editingTextId, elements, viewportScale } = useEditorData()
  const { selectElement, setEditingTextId, updateElement, setSnapGuides } = useEditorCommands()
  const textEditorRef = useRef<HTMLDivElement | null>(null)

  const elementCursorClass = activeTool === 'move' ? 'cursor-move' : activeTool === 'scale' ? 'cursor-se-resize' : 'cursor-default'
  const selectionOutlineClass = element.type === 'circle' ? 'rounded-full' : 'rounded-md'
  const textMode = String(element.styles.textMode ?? 'auto')
  const isEditingText = element.type === 'text' && editingTextId === element.id

  const left = Number(element.styles.left ?? 0)
  const top = Number(element.styles.top ?? 0)
  const width = element.styles.width ?? (element.type === 'text' ? 'auto' : 100)
  const height = element.styles.height ?? (element.type === 'text' ? 'auto' : 100)

  const canDrag = activeTool === 'move' && !isEditingText
  const canResize = (activeTool === 'move' || activeTool === 'scale') && !isEditingText
  const isLocked = Boolean(element.locked)
  const guideRafRef = useRef<number | null>(null)
  const pendingDragRectRef = useRef<DragSnapInput | null>(null)
  const lastGuidesKeyRef = useRef('')

  const snapCandidates = useMemo<SnapRect[]>(() =>
    elements
      .filter((el) => el.id !== element.id && !el.hidden && !el.locked)
      .map((el) => ({
        id: el.id,
        left: Number(el.styles.left ?? 0),
        top: Number(el.styles.top ?? 0),
        width: Number(el.styles.width ?? 0),
        height: Number(el.styles.height ?? 0),
        parentId: el.parentId ?? null
      })), [elements, element.id])

  const guidesKey = (guides: Array<{ type: 'v' | 'h'; position: number }>) =>
    guides.map((guide) => `${guide.type}:${Math.round(guide.position)}`).join('|')

  const flushDragGuides = () => {
    const rect = pendingDragRectRef.current
    if (!rect) {
      return
    }

    const result = computeSnap(rect, snapCandidates)
    const key = guidesKey(result.guides)

    if (key !== lastGuidesKeyRef.current) {
      lastGuidesKeyRef.current = key
      setSnapGuides(result.guides)
    }
  }

  const scheduleDragGuides = (rect: DragSnapInput) => {
    pendingDragRectRef.current = rect
    if (guideRafRef.current != null) {
      return
    }

    guideRafRef.current = window.requestAnimationFrame(() => {
      guideRafRef.current = null
      flushDragGuides()
    })
  }

  useEffect(() => {
    return () => {
      if (guideRafRef.current != null) {
        window.cancelAnimationFrame(guideRafRef.current)
      }
    }
  }, [])

  if (element.hidden) {
    return null
  }

  useEffect(() => {
    if (!isEditingText) {
      return
    }

    const node = textEditorRef.current
    if (!node) {
      return
    }

    node.focus()
    const selection = window.getSelection()
    if (!selection) {
      return
    }
    const range = document.createRange()
    range.selectNodeContents(node)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }, [isEditingText])

  const commitTextValue = () => {
    if (!isEditingText) {
      return
    }

    const node = textEditorRef.current
    const nextText = node?.innerText ?? ''
    updateElement(element.id, {
      styles: {
        ...element.styles,
        text: nextText.trim().length > 0 ? nextText : 'Text'
      }
    })
    setEditingTextId(null)
  }

  return (
    <Rnd
      scale={viewportScale}
      size={{ width, height }}
      position={{ x: left, y: top }}
      disableDragging={!canDrag || isLocked}
      enableResizing={isSelected && canResize && !isLocked
        ? {
            bottomRight: true
          }
        : false}
      onMouseDown={(e) => {
        e.stopPropagation()

        if (activeTool === 'hand') {
          return
        }

        const canSelect = activeTool === 'move' || activeTool === 'scale' || (activeTool === 'text' && element.type === 'text')
        if (!canSelect) {
          return
        }

        selectElement(element.id)
      }}
      onDrag={(_, data) => {
        if (isLocked) return
        scheduleDragGuides({
          x: data.x,
          y: data.y,
          width: Number(width),
          height: Number(height),
          id: element.id,
          parentId: element.parentId ?? null
        })
      }}
      onDragStop={(_, data) => {
        if (isLocked) return

        if (guideRafRef.current != null) {
          window.cancelAnimationFrame(guideRafRef.current)
          guideRafRef.current = null
        }

        const result = computeSnap(
          { x: data.x, y: data.y, width: Number(width), height: Number(height), id: element.id, parentId: element.parentId ?? null },
          snapCandidates
        )
        setSnapGuides([])
        pendingDragRectRef.current = null
        lastGuidesKeyRef.current = ''
        updateElement(element.id, {
          styles: { ...element.styles, left: result.x, top: result.y }
        })
      }}
      onResizeStop={(_, __, ref, ___, position) => {
        if (isLocked) return
        const w = ref.offsetWidth
        const h = ref.offsetHeight
        const result = computeSnap(
          { x: position.x, y: position.y, width: w, height: h, id: element.id, parentId: element.parentId ?? null },
          snapCandidates
        )
        setSnapGuides([])
        updateElement(element.id, {
          styles: { ...element.styles, left: result.x, top: result.y, width: w, height: h }
        })
      }}
      className="data-editor-element"
      style={{ zIndex: isSelected ? 3 : 1 }}
    >
      <div
        data-editor-element="true"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => {
          if (element.type !== 'text') {
            return
          }
          e.stopPropagation()
          setEditingTextId(element.id)
        }}
        className={`relative h-full w-full ${elementCursorClass}`}
        style={{ ...element.styles, left: undefined, top: undefined, width: '100%', height: '100%' }}
      >
      {element.type === 'text' ? (
        <div
          ref={textEditorRef}
          contentEditable={isEditingText}
          suppressContentEditableWarning
          onMouseDown={(e) => {
            if (isEditingText) {
              e.stopPropagation()
            }
          }}
          onBlur={commitTextValue}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              commitTextValue()
            }
            if (e.key === 'Escape') {
              e.preventDefault()
              setEditingTextId(null)
            }
          }}
          className={`${isEditingText ? 'pointer-events-auto select-text rounded-sm px-0.5 outline-2 outline-[var(--primary-color)] outline-offset-[-3px]' : 'pointer-events-none select-none'} whitespace-pre-wrap text-inherit ${textMode === 'fixed' ? 'h-full w-full overflow-hidden' : 'inline-block'}`}
        >
          {String(element.styles.text ?? 'Text')}
        </div>
      ) : null}

      {isSelected && (activeTool === 'move' || activeTool === 'scale') && (
        <div
          className={`pointer-events-none absolute -inset-1 outline-2 outline-[var(--primary-color)] outline-offset-[-3px] ${selectionOutlineClass}`}
        />
      )}

      {isSelected && (activeTool === 'move' || activeTool === 'scale') && !isEditingText && !isLocked && (
        <div
          className="absolute -bottom-2 -right-2 flex h-5 w-5 cursor-se-resize items-center justify-center rounded-full outline-2 outline-[var(--primary-color)] outline-offset-[-1px] bg-[var(--surface-0)] shadow-md"
          title="Resize"
          aria-label="Resize element"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-color)]" />
        </div>
      )}

      {children}
      </div>
    </Rnd>
  )
}