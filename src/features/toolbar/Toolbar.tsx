import { type ReactNode, useMemo } from 'react'
import { Button } from 'primereact/button'
import { Toolbar as PrimeToolbar } from 'primereact/toolbar'
import {
  Circle,
  Copy,
  Eye,
  EyeOff,
  Hand,
  Lock,
  LockOpen,
  Minus,
  MousePointer2,
  MoveUp,
  MoveDown,
  Scale,
  Square,
  Trash2,
  Type
} from 'lucide-react'
import { useEditorCommands, useEditorData } from '../state/EditorContext'

const TOOL_ICONS = {
  move: <MousePointer2 size={20} strokeWidth={1.75} aria-hidden="true" />,
  hand: <Hand size={20} strokeWidth={1.75} aria-hidden="true" />,
  scale: <Scale size={20} strokeWidth={1.75} aria-hidden="true" />,
  square: <Square size={20} strokeWidth={1.75} aria-hidden="true" />,
  circle: <Circle size={20} strokeWidth={1.75} aria-hidden="true" />,
  line: <Minus size={20} strokeWidth={1.75} aria-hidden="true" />,
  text: <Type size={20} strokeWidth={1.75} aria-hidden="true" />
}

export function Toolbar() {
  const { activeTool, selectedId, selectedElement } = useEditorData()
  const {
    setActiveTool,
    duplicateSelectedElement,
    deleteSelectedElement,
    moveElementLayer,
    toggleSelectedLock,
    toggleSelectedVisibility
  } = useEditorCommands()

  const hasSelection = Boolean(selectedId)
  const isLocked = Boolean(selectedElement?.locked)
  const isHidden = Boolean(selectedElement?.hidden)

  const startContent = useMemo(() => {
    const button = (options: {
      ariaLabel: string
      icon: ReactNode
      onClick: () => void
      disabled?: boolean
      selected?: boolean
      danger?: boolean
      tooltip?: string
    }) => {
      const { ariaLabel, icon, onClick, disabled = false, selected = false, danger = false, tooltip } = options

      return (
        <Button
          key={ariaLabel}
          type="button"
          aria-label={ariaLabel}
          icon={icon}
          disabled={disabled}
          rounded
          text={false}
          outlined={!selected}
          severity={danger ? 'danger' : 'secondary'}
          className="h-11 w-11"
          tooltip={tooltip ?? ariaLabel}
          tooltipOptions={{ position: 'top', showDelay: 120 }}
          onClick={onClick}
        />
      )
    }

    return (
      <div className="flex items-center gap-2.5">
        {button({ ariaLabel: 'Move Tool', tooltip: 'Select and move', icon: TOOL_ICONS.move, selected: activeTool === 'move', onClick: () => setActiveTool('move') })}
        {button({ ariaLabel: 'Hand Tool', tooltip: 'Pan canvas', icon: TOOL_ICONS.hand, selected: activeTool === 'hand', onClick: () => setActiveTool('hand') })}
        {button({ ariaLabel: 'Scale Tool', tooltip: 'Scale / resize mode', icon: TOOL_ICONS.scale, selected: activeTool === 'scale', onClick: () => setActiveTool('scale') })}
        {button({ ariaLabel: 'Square Tool', tooltip: 'Insert rectangle', icon: TOOL_ICONS.square, selected: activeTool === 'square', onClick: () => setActiveTool('square') })}
        {button({ ariaLabel: 'Circle Tool', tooltip: 'Insert ellipse', icon: TOOL_ICONS.circle, selected: activeTool === 'circle', onClick: () => setActiveTool('circle') })}
        {button({ ariaLabel: 'Line Tool', tooltip: 'Insert line', icon: TOOL_ICONS.line, selected: activeTool === 'line', onClick: () => setActiveTool('line') })}
        {button({ ariaLabel: 'Text Tool', tooltip: 'Insert text', icon: TOOL_ICONS.text, selected: activeTool === 'text', onClick: () => setActiveTool('text') })}
        <span className="mx-1 h-8 w-px bg-[var(--surface-border)]" aria-hidden="true" />
        {button({ ariaLabel: 'Bring To Front', icon: <MoveUp size={20} strokeWidth={1.75} aria-hidden="true" />, disabled: !hasSelection, onClick: () => selectedId && moveElementLayer(selectedId, 'front') })}
        {button({ ariaLabel: 'Send To Back', icon: <MoveDown size={20} strokeWidth={1.75} aria-hidden="true" />, disabled: !hasSelection, onClick: () => selectedId && moveElementLayer(selectedId, 'back') })}
        {button({ ariaLabel: isLocked ? 'Unlock Element' : 'Lock Element', icon: isLocked ? <Lock size={20} strokeWidth={1.75} aria-hidden="true" /> : <LockOpen size={20} strokeWidth={1.75} aria-hidden="true" />, selected: isLocked, disabled: !hasSelection, onClick: () => toggleSelectedLock() })}
        {button({ ariaLabel: isHidden ? 'Show Element' : 'Hide Element', icon: isHidden ? <EyeOff size={20} strokeWidth={1.75} aria-hidden="true" /> : <Eye size={20} strokeWidth={1.75} aria-hidden="true" />, selected: isHidden, disabled: !hasSelection, onClick: () => toggleSelectedVisibility() })}
        {button({ ariaLabel: 'Duplicate', icon: <Copy size={20} strokeWidth={1.75} aria-hidden="true" />, disabled: !hasSelection, onClick: () => duplicateSelectedElement() })}
        {button({ ariaLabel: 'Delete', icon: <Trash2 size={20} strokeWidth={1.75} aria-hidden="true" />, danger: true, disabled: !hasSelection, onClick: () => deleteSelectedElement() })}
      </div>
    )
  }, [
    activeTool,
    deleteSelectedElement,
    duplicateSelectedElement,
    hasSelection,
    isHidden,
    isLocked,
    moveElementLayer,
    selectedId,
    setActiveTool,
    toggleSelectedLock,
    toggleSelectedVisibility
  ])

  return (
    <PrimeToolbar
      className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-xl border-0 bg-[var(--surface-card)] px-3 py-2.5 shadow-xl"
      start={startContent}
    />
  )
}
