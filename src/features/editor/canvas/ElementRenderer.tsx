import { useEffect, useRef, type ReactNode } from 'react'
import { Rnd } from 'react-rnd'
import type { Element } from '../../../core/editor/types'
import { useEditorCommands, useEditorData } from '../state/EditorContext'

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
  const { activeTool, editingTextId } = useEditorData()
  const { selectElement, setEditingTextId, updateElement } = useEditorCommands()
  const textEditorRef = useRef<HTMLDivElement | null>(null)

  const elementCursorClass = activeTool === 'move' ? 'cursor-move' : 'cursor-default'
  const selectionOutlineClass = element.type === 'circle' ? 'rounded-full' : 'rounded-md'
  const textMode = String(element.styles.textMode ?? 'auto')
  const isEditingText = element.type === 'text' && editingTextId === element.id

  const left = Number(element.styles.left ?? 0)
  const top = Number(element.styles.top ?? 0)
  const width = element.styles.width ?? (element.type === 'text' ? 'auto' : 100)
  const height = element.styles.height ?? (element.type === 'text' ? 'auto' : 100)

  const canTransform = activeTool === 'move' && !isEditingText

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
      disableDragging={!canTransform}
      enableResizing={isSelected && canTransform
        ? {
            bottomRight: true
          }
        : false}
      onMouseDown={(e) => {
        e.stopPropagation()
        selectElement(element.id)
      }}
      onDragStop={(_, data) => {
        updateElement(element.id, {
          styles: {
            ...element.styles,
            left: data.x,
            top: data.y
          }
        })
      }}
      onResizeStop={(_, __, ref, ___, position) => {
        updateElement(element.id, {
          styles: {
            ...element.styles,
            left: position.x,
            top: position.y,
            width: ref.offsetWidth,
            height: ref.offsetHeight
          }
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

      {isSelected && activeTool === 'move' && (
        <div
          className={`pointer-events-none absolute -inset-1 border-2 border-blue-400/90 shadow-[0_0_0_3px_rgba(59,130,246,0.2)] ${selectionOutlineClass}`}
        />
      )}

      {isSelected && activeTool === 'move' && !isEditingText && (
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