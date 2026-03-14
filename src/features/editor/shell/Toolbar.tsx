import { useEditorCommands } from '../state/EditorContext'

const TOOLBAR_ITEMS = [
  {
    type: 'square' as const,
    label: 'Add square',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  },
  {
    type: 'circle' as const,
    label: 'Add circle',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  },
  {
    type: 'line' as const,
    label: 'Add line',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path d="M5 16 L19 8" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      </svg>
    )
  }
]

export function Toolbar() {
  const { addElement } = useEditorCommands()

  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
      <div className="flex items-center gap-2">
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.type}
            type="button"
            title={item.label}
            aria-label={item.label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600"
            onClick={() => addElement(item.type)}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  )
}