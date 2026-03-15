import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Rnd } from 'react-rnd'
import type { ResizeDirection } from 're-resizable'
import type { Element } from '../../../core/types'
import { useCanvasCommandDomain, useCanvasQueryDomain } from '../../state'
import { computeSnapFromLookup, createSnapGuideLookup, type SnapRect } from '../model/snapEngine'
import {
  canDragElement,
  canResizeElement,
  canSelectElementFromPointer,
  canShowElementSelectionChrome,
  resolveElementCursorClass,
} from '../interaction/interactionMachine'
import type { CanvasInteractionEvent } from '../interaction/interactionMachine'

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
  onInteractionSignal?: (event: CanvasInteractionEvent) => boolean
}

export function ElementRenderer({
  element,
  isSelected,
  children,
  onInteractionSignal,
}: ElementRendererProps) {
  const {
    activeTool,
    editingTextId,
    elements,
    viewportScale,
  } = useCanvasQueryDomain()
  const {
    selectElement,
    startTextEditing,
    stopTextEditing,
    updateElement,
    updateSnapGuides,
    clearSnapGuides,
  } = useCanvasCommandDomain()
  const textEditorRef = useRef<HTMLDivElement | null>(null)

  const elementCursorClass = resolveElementCursorClass(activeTool)
  const selectionOutlineClass = element.type === 'circle' ? 'rounded-full' : 'rounded-md'
  const isEditingText = element.type === 'text' && editingTextId === element.id

  const left = Number(element.styles.left ?? 0)
  const top = Number(element.styles.top ?? 0)
  const width = element.styles.width ?? (element.type === 'text' ? 'auto' : 100)
  const height = element.styles.height ?? (element.type === 'text' ? 'auto' : 100)

  const canDrag = canDragElement(activeTool, isEditingText)
  const canResize = canResizeElement(activeTool, isEditingText)
  const isLocked = Boolean(element.locked)
  const canSnapInteract = isSelected && !isLocked && (canDrag || canResize)
  const supportsAllSideResize = element.type === 'square' || element.type === 'circle'
  const showResizeAffordances = isSelected && canShowElementSelectionChrome(activeTool) && !isEditingText && !isLocked
  const resizeHandles = supportsAllSideResize
    ? {
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        topLeft: true,
        bottomRight: true,
        bottomLeft: true,
      }
    : {
        bottomRight: true
      }
  const resizeHandleStyles = supportsAllSideResize
    ? {
        top: { cursor: 'ns-resize' },
        right: { cursor: 'ew-resize' },
        bottom: { cursor: 'ns-resize' },
        left: { cursor: 'ew-resize' },
        topRight: { cursor: 'nesw-resize' },
        topLeft: { cursor: 'nwse-resize' },
        bottomRight: { cursor: 'nwse-resize' },
        bottomLeft: { cursor: 'nesw-resize' },
      }
    : {
        bottomRight: { cursor: 'nwse-resize' }
      }
  const guideRafRef = useRef<number | null>(null)
  const pendingDragRectRef = useRef<DragSnapInput | null>(null)
  const lastGuidesKeyRef = useRef('')

  const snapCandidates = useMemo<SnapRect[]>(() => {
    if (!canSnapInteract) {
      return []
    }

    return elements
      .filter((el) => el.id !== element.id && !el.hidden && !el.locked && (el.parentId ?? null) === (element.parentId ?? null))
      .map((el) => ({
        id: el.id,
        left: Number(el.styles.left ?? 0),
        top: Number(el.styles.top ?? 0),
        width: Number(el.styles.width ?? 0),
        height: Number(el.styles.height ?? 0),
        parentId: el.parentId ?? null
      }))
  }, [canSnapInteract, elements, element.id, element.parentId])

  const snapLookup = useMemo(() => {
    if (!canSnapInteract) {
      return null
    }

    return createSnapGuideLookup(snapCandidates)
  }, [canSnapInteract, snapCandidates])

  const guidesKey = (guides: Array<{ type: 'v' | 'h'; position: number }>) =>
    guides.map((guide) => `${guide.type}:${Math.round(guide.position)}`).join('|')

  const flushDragGuides = () => {
    const rect = pendingDragRectRef.current
    if (!rect || !snapLookup) {
      return
    }

    const result = computeSnapFromLookup(rect, snapLookup)
    const key = guidesKey(result.guides)

    if (key !== lastGuidesKeyRef.current) {
      lastGuidesKeyRef.current = key
      updateSnapGuides(result.guides)
    }
  }

  const scheduleDragGuides = (rect: DragSnapInput) => {
    if (!snapLookup) {
      return
    }

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
    stopTextEditing()
    onInteractionSignal?.({ type: 'TEXT_EDIT_END' })
  }

  return (
    <Rnd
      scale={viewportScale}
      size={{ width, height }}
      position={{ x: left, y: top }}
      disableDragging={!canDrag || isLocked}
      enableResizing={isSelected && canResize && !isLocked
        ? resizeHandles
        : false}
      resizeHandleStyles={resizeHandleStyles}
      onMouseDown={(e) => {
        e.stopPropagation()

        const canSelect = canSelectElementFromPointer(activeTool, element.type === 'text')
        if (!canSelect) {
          return
        }

        selectElement(element.id)
      }}
      onDrag={(_, data) => {
        if (isLocked) return
        if (!snapLookup) return
        scheduleDragGuides({
          x: data.x,
          y: data.y,
          width: Number(width),
          height: Number(height),
          id: element.id,
          parentId: element.parentId ?? null
        })
      }}
      onDragStart={() => {
        if (!isLocked) {
          onInteractionSignal?.({ type: 'DRAG_START', elementId: element.id })
        }
      }}
      onDragStop={(_, data) => {
        if (isLocked) return

        if (guideRafRef.current != null) {
          window.cancelAnimationFrame(guideRafRef.current)
          guideRafRef.current = null
        }

        const result = snapLookup
          ? computeSnapFromLookup(
            { x: data.x, y: data.y, width: Number(width), height: Number(height) },
            snapLookup
          )
          : { x: data.x, y: data.y, guides: [] }
        clearSnapGuides()
        pendingDragRectRef.current = null
        lastGuidesKeyRef.current = ''
        updateElement(element.id, {
          styles: { ...element.styles, left: result.x, top: result.y }
        })
        onInteractionSignal?.({ type: 'DRAG_END' })
      }}
      onResizeStart={(_, direction: ResizeDirection) => {
        if (!isLocked) {
          onInteractionSignal?.({ type: 'RESIZE_START', elementId: element.id, handle: direction })
        }
      }}
      onResizeStop={(_, __, ref, ___, position) => {
        if (isLocked) return
        const w = ref.offsetWidth
        const h = ref.offsetHeight
        const result = snapLookup
          ? computeSnapFromLookup(
            { x: position.x, y: position.y, width: w, height: h },
            snapLookup
          )
          : { x: position.x, y: position.y, guides: [] }
        clearSnapGuides()
        updateElement(element.id, {
          styles: { ...element.styles, left: result.x, top: result.y, width: w, height: h }
        })
        onInteractionSignal?.({ type: 'RESIZE_END' })
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
          const admitted = onInteractionSignal?.({ type: 'TEXT_EDIT_START', elementId: element.id }) ?? true
          if (!admitted) {
            return
          }
          startTextEditing(element.id)
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
              stopTextEditing()
              onInteractionSignal?.({ type: 'TEXT_EDIT_END' })
            }
          }}
          className={isEditingText ? 'pointer-events-auto select-text' : 'pointer-events-none select-none'}
        >
          {String(element.styles.text ?? 'Text')}
        </div>
      ) : null}

      {isSelected && canShowElementSelectionChrome(activeTool) && (
        <div
          className={`pointer-events-none absolute -inset-1 outline-2 outline-[var(--primary-color)] outline-offset-[-3px] ${selectionOutlineClass}`}
        />
      )}

      {showResizeAffordances && supportsAllSideResize && (
        <>
          <div className="pointer-events-none absolute -top-1.5 left-1/2 h-3 w-7 -translate-x-1/2 rounded-full border-2 border-[var(--primary-color)] bg-[var(--surface-0)] shadow-[0_2px_10px_rgba(0,0,0,0.22)]" />
          <div className="pointer-events-none absolute -bottom-1.5 left-1/2 h-3 w-7 -translate-x-1/2 rounded-full border-2 border-[var(--primary-color)] bg-[var(--surface-0)] shadow-[0_2px_10px_rgba(0,0,0,0.22)]" />
          <div className="pointer-events-none absolute -left-1.5 top-1/2 h-7 w-3 -translate-y-1/2 rounded-full border-2 border-[var(--primary-color)] bg-[var(--surface-0)] shadow-[0_2px_10px_rgba(0,0,0,0.22)]" />
          <div className="pointer-events-none absolute -right-1.5 top-1/2 h-7 w-3 -translate-y-1/2 rounded-full border-2 border-[var(--primary-color)] bg-[var(--surface-0)] shadow-[0_2px_10px_rgba(0,0,0,0.22)]" />

          <div className="pointer-events-none absolute -left-2 -top-2 h-4 w-4 rounded-[0.45rem] border-2 border-[var(--primary-color)] bg-[var(--surface-0)] shadow-[0_2px_10px_rgba(0,0,0,0.24)]" />
          <div className="pointer-events-none absolute -right-2 -top-2 h-4 w-4 rounded-[0.45rem] border-2 border-[var(--primary-color)] bg-[var(--surface-0)] shadow-[0_2px_10px_rgba(0,0,0,0.24)]" />
          <div className="pointer-events-none absolute -left-2 -bottom-2 h-4 w-4 rounded-[0.45rem] border-2 border-[var(--primary-color)] bg-[var(--surface-0)] shadow-[0_2px_10px_rgba(0,0,0,0.24)]" />
          <div className="pointer-events-none absolute -right-2 -bottom-2 h-4 w-4 rounded-[0.45rem] border-2 border-[var(--primary-color)] bg-[var(--surface-0)] shadow-[0_2px_10px_rgba(0,0,0,0.24)]" />
        </>
      )}

      {showResizeAffordances && !supportsAllSideResize && (
        <div
          className="absolute -bottom-2 -right-2 flex h-4 w-4 cursor-se-resize items-center justify-center rounded-[0.45rem] border-2 border-[var(--primary-color)] bg-[var(--surface-0)] shadow-[0_2px_10px_rgba(0,0,0,0.24)]"
          title="Resize"
          aria-label="Resize element"
        >
          <span className="h-1.5 w-1.5 rounded-[2px] bg-[var(--primary-color)]" />
        </div>
      )}

      {children}
      </div>
    </Rnd>
  )
}