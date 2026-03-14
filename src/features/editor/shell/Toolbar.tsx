import { type ReactNode } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Circle, Hand, Move, Slash, Square, Type } from 'lucide-react'
import { EDITOR_TOOLS, type EditorToolId } from '../../../core/editor/tools'
import { useEditorCommands, useEditorData } from '../state/EditorContext'
import { cn, uiTokens } from '../ui/tokens'

const TOOL_ICONS: Record<EditorToolId, ReactNode> = {
  move: <Move className="h-5 w-5" aria-hidden="true" />,
  hand: <Hand className="h-5 w-5" aria-hidden="true" />,
  square: <Square className="h-5 w-5" aria-hidden="true" />,
  circle: <Circle className="h-5 w-5" aria-hidden="true" />,
  line: <Slash className="h-5 w-5" aria-hidden="true" />,
  text: <Type className="h-5 w-5" aria-hidden="true" />
}

export function Toolbar() {
  const { activeTool } = useEditorData()
  const { setActiveTool } = useEditorCommands()

  useHotkeys('v', () => setActiveTool('move'))
  useHotkeys('h', () => setActiveTool('hand'))
  useHotkeys('r', () => setActiveTool('square'))
  useHotkeys('o', () => setActiveTool('circle'))
  useHotkeys('l', () => setActiveTool('line'))
  useHotkeys('t', () => setActiveTool('text'))

  return (
    <div className={cn('fixed bottom-4 left-1/2 z-40 -translate-x-1/2', uiTokens.shell.toolbar, uiTokens.motion.panel, 'hover:shadow-xl')}>
      <div className="flex items-center gap-2">
        {EDITOR_TOOLS.map((item, index) => (
          <div key={item.id} className="contents">
            {index === 2 ? <div className="mx-1 h-8 w-px bg-slate-200" aria-hidden="true" /> : null}
            <button
              type="button"
              title={`${item.label} (${item.shortcut})`}
              aria-label={`${item.label} tool`}
              aria-pressed={activeTool === item.id}
              className={activeTool === item.id
                ? cn(
                    uiTokens.control.iconButtonToolbar,
                    uiTokens.motion.control,
                    uiTokens.focus.ring,
                    uiTokens.control.iconButtonActive,
                    uiTokens.control.toolbarSelected
                  )
                : cn(
                    uiTokens.control.iconButtonToolbar,
                    uiTokens.motion.control,
                    uiTokens.focus.ring,
                    uiTokens.control.iconButtonHover,
                    uiTokens.control.iconButtonActive,
                    uiTokens.control.toolbarIdle
                  )}
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