import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, Minus } from 'lucide-react'
import { getPropertyRegistry, groupProperties } from '../../../utils/propertyRegistry'
import { PropertyInput } from './PropertyInput'
import { useEditorCommands, useEditorData } from '../state/EditorContext'
import { cn, uiTokens } from '../ui/tokens'

export function PropertiesPanel() {
  const { selectedElement } = useEditorData()
  const { updateElement } = useEditorCommands()
  const [mode, setMode] = useState<'common' | 'all'>('common')
  const [search, setSearch] = useState('')

  const [isMinimized, setIsMinimized] = useState(false)
  const [width, setWidth] = useState(340)
  const [isResizing, setIsResizing] = useState(false)

  const grouped = useMemo(() => {
    const base = getPropertyRegistry(mode)
    const query = search.trim().toLowerCase()
    const filtered = query.length === 0
      ? base
      : base.filter((prop) => {
          return (
            prop.name.toLowerCase().includes(query) ||
            prop.cssProperty.toLowerCase().includes(query) ||
            prop.group.toLowerCase().includes(query)
          )
        })
    return groupProperties(filtered)
  }, [mode, search])

  useEffect(() => {
    if (!isResizing) {
      return
    }

    const onMouseMove = (e: MouseEvent) => {
      const nextWidth = window.innerWidth - e.clientX - 16
      setWidth(Math.min(560, Math.max(280, nextWidth)))
    }

    const onMouseUp = () => {
      setIsResizing(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isResizing])

  if (isMinimized) {
    return (
      <button
        type="button"
        aria-label="Expand properties panel"
        title="Expand properties panel"
        className={cn(
          'fixed right-4 top-1/2 z-40 -translate-y-1/2 rounded-l-xl px-2 py-3',
          uiTokens.control.iconButton,
          uiTokens.motion.control,
          uiTokens.control.iconButtonHover,
          uiTokens.control.iconButtonActive,
          uiTokens.focus.ring,
          'border-slate-300 bg-white shadow'
        )}
        onClick={() => setIsMinimized(false)}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
    )
  }

  return (
    <aside
      className={cn('fixed right-4 top-4 bottom-4 z-30', uiTokens.shell.panel, uiTokens.motion.panel)}
      style={{ width }}
    >
      <div
        className="absolute left-0 top-0 h-full w-2 -translate-x-1/2 cursor-col-resize"
        onMouseDown={() => setIsResizing(true)}
      />

      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className={uiTokens.text.heading}>Properties</h3>
          <button
            type="button"
            aria-label="Minimize properties panel"
            title="Minimize properties panel"
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
          <div className="mb-4 space-y-3">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                className={cn(
                  uiTokens.control.chip,
                  uiTokens.motion.control,
                  uiTokens.focus.ring,
                  mode === 'common' ? uiTokens.control.chipSelected : uiTokens.control.chipIdle
                )}
                onClick={() => setMode('common')}
              >
                Common
              </button>
              <button
                type="button"
                className={cn(
                  uiTokens.control.chip,
                  uiTokens.motion.control,
                  uiTokens.focus.ring,
                  mode === 'all' ? uiTokens.control.chipSelected : uiTokens.control.chipIdle
                )}
                onClick={() => setMode('all')}
              >
                All
              </button>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties"
              className={cn(uiTokens.input.base, uiTokens.motion.control, uiTokens.input.hover, uiTokens.focus.ringSoft)}
            />
          </div>

          {!selectedElement ? (
            <p className="text-sm text-slate-500">No element selected</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).map(([group, props]) => (
                <details key={group} className={cn(uiTokens.accordion.details, 'group')}>
                  <summary className={cn(uiTokens.accordion.summary, uiTokens.motion.control, uiTokens.accordion.summaryHover, uiTokens.accordion.summaryFocus, 'flex items-center justify-between')}>
                    <span>{group}</span>
                    <ChevronDown className={uiTokens.accordion.chevron} aria-hidden="true" />
                  </summary>
                  <div className="space-y-2 p-3">
                    {props.map(prop => (
                      <div key={prop.name}>
                        <label className="block text-xs font-medium text-slate-600">{prop.name}</label>
                        <PropertyInput
                          property={prop}
                          value={selectedElement.styles[prop.cssProperty] ?? prop.default}
                          onChange={(val) => updateElement(selectedElement.id, {
                            styles: { ...selectedElement.styles, [prop.cssProperty]: val }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}