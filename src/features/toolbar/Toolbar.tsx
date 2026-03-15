import { useMemo } from 'react'
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
  Square,
  Trash2,
  Type,
} from 'lucide-react'
import { useSelectionCommandDomain, useSelectionQueryDomain, useToolDomain, useViewportDomain } from '../state'
import { IconActionButton } from '../ui'
import { ZoomMenuButton } from './ZoomMenuButton'

const TOOL_ICONS = {
  move: <MousePointer2 size={20} strokeWidth={1.75} aria-hidden="true" />,
  hand: <Hand size={20} strokeWidth={1.75} aria-hidden="true" />,
  square: <Square size={20} strokeWidth={1.75} aria-hidden="true" />,
  circle: <Circle size={20} strokeWidth={1.75} aria-hidden="true" />,
  line: <Minus size={20} strokeWidth={1.75} aria-hidden="true" />,
  text: <Type size={20} strokeWidth={1.75} aria-hidden="true" />
}

export function Toolbar() {
  const { activeTool, setActiveTool } = useToolDomain()
  const { viewportScale, setViewportScale } = useViewportDomain()
  const {
    hasSelection,
    isLocked,
    isHidden,
  } = useSelectionQueryDomain()
  const {
    duplicateSelectedElement,
    deleteSelectedElement,
    moveSelectionLayer,
    toggleSelectedLock,
    toggleSelectedVisibility
  } = useSelectionCommandDomain()

  const startContent = useMemo(() => {
    return (
      <div className="flex items-center gap-2.5">
        <IconActionButton ariaLabel="Move Tool" tooltip="Select and move" icon={TOOL_ICONS.move} selected={activeTool === 'move'} onClick={() => setActiveTool('move')} />
        <IconActionButton ariaLabel="Hand Tool" tooltip="Pan canvas" icon={TOOL_ICONS.hand} selected={activeTool === 'hand'} onClick={() => setActiveTool('hand')} />
        <IconActionButton ariaLabel="Square Tool" tooltip="Insert rectangle" icon={TOOL_ICONS.square} selected={activeTool === 'square'} onClick={() => setActiveTool('square')} />
        <IconActionButton ariaLabel="Circle Tool" tooltip="Insert ellipse" icon={TOOL_ICONS.circle} selected={activeTool === 'circle'} onClick={() => setActiveTool('circle')} />
        <IconActionButton ariaLabel="Line Tool" tooltip="Insert line" icon={TOOL_ICONS.line} selected={activeTool === 'line'} onClick={() => setActiveTool('line')} />
        <IconActionButton ariaLabel="Text Tool" tooltip="Insert text" icon={TOOL_ICONS.text} selected={activeTool === 'text'} onClick={() => setActiveTool('text')} />
        <span className="mx-1 h-8 w-px bg-[var(--surface-border)]" aria-hidden="true" />
        <IconActionButton ariaLabel="Bring To Front" icon={<MoveUp size={20} strokeWidth={1.75} aria-hidden="true" />} disabled={!hasSelection} onClick={() => moveSelectionLayer('front')} />
        <IconActionButton ariaLabel="Send To Back" icon={<MoveDown size={20} strokeWidth={1.75} aria-hidden="true" />} disabled={!hasSelection} onClick={() => moveSelectionLayer('back')} />
        <IconActionButton ariaLabel={isLocked ? 'Unlock Element' : 'Lock Element'} icon={isLocked ? <Lock size={20} strokeWidth={1.75} aria-hidden="true" /> : <LockOpen size={20} strokeWidth={1.75} aria-hidden="true" />} selected={isLocked} disabled={!hasSelection} onClick={() => toggleSelectedLock()} />
        <IconActionButton ariaLabel={isHidden ? 'Show Element' : 'Hide Element'} icon={isHidden ? <EyeOff size={20} strokeWidth={1.75} aria-hidden="true" /> : <Eye size={20} strokeWidth={1.75} aria-hidden="true" />} selected={isHidden} disabled={!hasSelection} onClick={() => toggleSelectedVisibility()} />
        <IconActionButton ariaLabel="Duplicate" icon={<Copy size={20} strokeWidth={1.75} aria-hidden="true" />} disabled={!hasSelection} onClick={() => duplicateSelectedElement()} />
        <IconActionButton ariaLabel="Delete" icon={<Trash2 size={20} strokeWidth={1.75} aria-hidden="true" />} danger disabled={!hasSelection} onClick={() => deleteSelectedElement()} />
        <span className="mx-1 h-8 w-px bg-[var(--surface-border)]" aria-hidden="true" />
        <ZoomMenuButton viewportScale={viewportScale} setViewportScale={setViewportScale} />
      </div>
    )
  }, [
    activeTool,
    viewportScale,
    setViewportScale,
    deleteSelectedElement,
    duplicateSelectedElement,
    hasSelection,
    isHidden,
    isLocked,
    moveSelectionLayer,
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
