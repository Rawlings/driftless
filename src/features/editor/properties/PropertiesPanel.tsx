import { useEffect, useMemo, useState } from 'react'
import { getPropertyRegistry, groupProperties } from '../../../utils/propertyRegistry'
import { PropertyInput } from './PropertyInput'
import { useEditorCommands, useEditorData } from '../state/EditorContext'

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
        className="fixed right-4 top-1/2 z-40 -translate-y-1/2 rounded-l-xl border border-slate-300 bg-white px-2 py-3 text-slate-700 shadow"
        onClick={() => setIsMinimized(false)}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M9 6 L15 12 L9 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )
  }

  return (
    <aside
      className="fixed right-4 top-4 bottom-4 z-30 rounded-2xl border border-slate-200 bg-white shadow-xl"
      style={{ width }}
    >
      <div
        className="absolute left-0 top-0 h-full w-2 -translate-x-1/2 cursor-col-resize"
        onMouseDown={() => setIsResizing(true)}
      />

      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="text-base font-semibold text-slate-800">Properties</h3>
          <button
            type="button"
            aria-label="Minimize properties panel"
            title="Minimize properties panel"
            className="rounded-md border border-slate-200 p-1.5 text-slate-700 hover:bg-slate-50"
            onClick={() => setIsMinimized(true)}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M6 12 H18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 space-y-3">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${mode === 'common' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                onClick={() => setMode('common')}
              >
                Common
              </button>
              <button
                type="button"
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${mode === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          {!selectedElement ? (
            <p className="text-sm text-slate-500">No element selected</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).map(([group, props]) => (
                <details key={group} className="overflow-hidden rounded-lg border border-slate-200">
                  <summary className="cursor-pointer bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{group}</summary>
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