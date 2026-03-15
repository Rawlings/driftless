import { useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Element } from '../../core/types'
import { ElementRenderer } from './ElementRenderer'
import type { SnapGuide } from './snapEngine'

interface CanvasSceneProps {
  elements: Element[]
  selectedId: string | null
  viewportOffset: { x: number; y: number }
  viewportScale: number
  snapGuides: SnapGuide[]
  shapePreviewClassName: string
  shapePreviewStyle: CSSProperties | null
}

export function CanvasScene({
  elements,
  selectedId,
  viewportOffset,
  viewportScale,
  snapGuides,
  shapePreviewClassName,
  shapePreviewStyle
}: CanvasSceneProps) {
  const childrenByParent = useMemo(() => {
    const map = new Map<string | null, Element[]>()
    elements.forEach((element) => {
      const key = element.parentId ?? null
      const group = map.get(key)
      if (group) {
        group.push(element)
      } else {
        map.set(key, [element])
      }
    })
    return map
  }, [elements])

  const renderElementTree = (element: Element): ReactNode => (
    <ElementRenderer key={element.id} element={element} isSelected={selectedId === element.id}>
      {(childrenByParent.get(element.id) ?? []).map((child) => renderElementTree(child))}
    </ElementRenderer>
  )

  return (
    <div
      className="absolute inset-0"
      style={{ transform: `translate(${viewportOffset.x}px, ${viewportOffset.y}px) scale(${viewportScale})`, transformOrigin: 'top left' }}
    >
      {(childrenByParent.get(null) ?? []).map((element) => renderElementTree(element))}

      {shapePreviewStyle ? (
        <div className={shapePreviewClassName} style={shapePreviewStyle} />
      ) : null}

      {snapGuides.map((guide, i) =>
        guide.type === 'v'
          ? <div key={i} className="pointer-events-none absolute inset-y-0 w-px bg-[var(--primary-color)] opacity-60" style={{ left: guide.position }} />
          : <div key={i} className="pointer-events-none absolute inset-x-0 h-px bg-[var(--primary-color)] opacity-60" style={{ top: guide.position }} />
      )}
    </div>
  )
}
