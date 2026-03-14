import { useEffect, useRef } from 'react'
import type { Element } from '../../../core/editor/types'
import { useEditorCommands, useEditorData, useEditorInteractions } from '../state/EditorContext'

interface ElementRendererProps {
  element: Element
  isSelected: boolean
}

export function ElementRenderer({
  element,
  isSelected
}: ElementRendererProps) {
  const { handleMouseDown, handleResizeMouseDown } = useEditorInteractions()
  const { activeTool, editingTextId } = useEditorData()
  const { setEditingTextId, updateElement } = useEditorCommands()
  const textEditorRef = useRef<HTMLDivElement | null>(null)

  const elementCursorClass = activeTool === 'move' ? 'cursor-move' : 'cursor-default'
  const selectionOutlineClass = element.type === 'circle' ? 'rounded-full' : 'rounded-md'
  const textMode = String(element.styles.textMode ?? 'auto')
  const isEditingText = element.type === 'text' && editingTextId === element.id

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
    <div
      data-editor-element="true"
      onMouseDown={(e) => handleMouseDown(e, element.id)}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => {
        if (element.type !== 'text') {
          return
        }
        e.stopPropagation()
        setEditingTextId(element.id)
      }}
      className={elementCursorClass}
      style={element.styles}
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
          onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
          onClick={(e) => e.stopPropagation()}
          className="absolute -bottom-2 -right-2 flex h-5 w-5 cursor-se-resize items-center justify-center rounded-full border-2 border-blue-500 bg-white shadow-md"
          title="Resize"
          aria-label="Resize element"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        </div>
      )}
    </div>
  )
}