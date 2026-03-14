import { useEffect, type ReactNode } from 'react'
import { EDITOR_TOOLS, type EditorToolId } from '../../../core/editor/tools'
import { useEditorCommands, useEditorData } from '../state/EditorContext'

const TOOL_ICONS: Record<EditorToolId, ReactNode> = {
  move: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3 L15 8 H13 V11 H16 V9 L21 12 L16 15 V13 H13 V16 H15 L12 21 L9 16 H11 V13 H8 V15 L3 12 L8 9 V11 H11 V8 H9 Z" fill="currentColor" />
    </svg>
  ),
  hand: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M7 11 V7 C7 6.4 7.4 6 8 6 C8.6 6 9 6.4 9 7 V11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 11 V5 C9 4.4 9.4 4 10 4 C10.6 4 11 4.4 11 5 V11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 11 V6 C11 5.4 11.4 5 12 5 C12.6 5 13 5.4 13 6 V11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 11 V7 C13 6.4 13.4 6 14 6 C14.6 6 15 6.4 15 7 V13 L16.4 11.8 C16.9 11.4 17.7 11.4 18.2 11.9 C18.7 12.4 18.7 13.2 18.2 13.7 L15.5 16.4 C14.6 17.3 13.4 17.8 12.1 17.8 H10.7 C8.7 17.8 7 16.1 7 14.1 V11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  line: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M5 16 L19 8" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  ),
  text: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M6 7 H18 M12 7 V18" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  )
}

export function Toolbar() {
  const { activeTool } = useEditorData()
  const { setActiveTool } = useEditorCommands()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }

      const key = e.key.toLowerCase()
      if (key === 'v') setActiveTool('move')
      if (key === 'h') setActiveTool('hand')
      if (key === 'r') setActiveTool('square')
      if (key === 'o') setActiveTool('circle')
      if (key === 'l') setActiveTool('line')
      if (key === 't') setActiveTool('text')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setActiveTool])

  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
      <div className="flex items-center gap-2">
        {EDITOR_TOOLS.map((item, index) => (
          <div key={item.id} className="contents">
            {index === 2 ? <div className="mx-1 h-8 w-px bg-slate-200" aria-hidden="true" /> : null}
            <button
              type="button"
              title={`${item.label} (${item.shortcut})`}
              aria-label={`${item.label} tool`}
              aria-pressed={activeTool === item.id}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                activeTool === item.id
                  ? 'border-blue-400 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600'
              }`}
              onClick={() => setActiveTool(item.id)}
            >
              {TOOL_ICONS[item.id]}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}