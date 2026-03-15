import { useEffect, useRef, type ReactNode } from 'react'
import { Rnd } from 'react-rnd'
import type { Element } from '../../core/types'
import { useEditorCommands, useEditorData } from '../state/EditorContext'
import { computeSnap, type SnapRect } from './snapEngine'

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
  const { activeTool, editingTextId, elements } = useEditorData()
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

  const snapCandidates = (): SnapRect[] =>
    elements
      .filter((el) => el.id !== element.id && !el.hidden && !el.locked)
      .map((el) => ({
        id: el.id,
        left: Number(el.styles.left ?? 0),
        top: Number(el.styles.top ?? 0),
        width: Number(el.styles.width ?? 0),
        height: Number(el.styles.height ?? 0),
        parentId: el.parentId ?? null
      }))

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
        const result = computeSnap(
          { x: data.x, y: data.y, width: Number(width), height: Number(height), id: element.id, parentId: element.parentId ?? null },
          snapCandidates()
        )
        setSnapGuides(result.guides)
      }}
      onDragStop={(_, data) => {
        if (isLocked) return
        const result = computeSnap(
          { x: data.x, y: data.y, width: Number(width), height: Number(height), id: element.id, parentId: element.parentId ?? null },
          snapCandidates()
        )
        setSnapGuides([])
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
          snapCandidates()
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
          className={`${isEditingText ? 'pointer-events-auto select-text rounded-sm bg-white/70 px-0.5 outline-none ring-2 ring-blue-400/70 ring-offset-1' : 'pointer-events-none select-none'} whitespace-pre-wrap text-inherit ${textMode === 'fixed' ? 'h-full w-full overflow-hidden' : 'inline-block'}`}
        >
          {String(element.styles.text ?? 'Text')}
        </div>
      ) : null}

      {isSelected && (activeTool === 'move' || activeTool === 'scale') && (
        <div
          className={`pointer-events-none absolute -inset-1 border-2 border-blue-400/90 shadow-[0_0_0_3px_rgba(59,130,246,0.2)] ${selectionOutlineClass}`}
        />
      )}

      {isSelected && (activeTool === 'move' || activeTool === 'scale') && !isEditingText && !isLocked && (
        <div
          className="absolute -bottom-2 -right-2 flex h-5 w-5 cursor-se-resize items-center justify-center rounded-full border-2 border-blue-500 bg-white shadow-md"
          title="Resize"
          aria-label="Resize element"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        </div>
      )}

      {children}
      </div>
    </Rnd>
  )
}