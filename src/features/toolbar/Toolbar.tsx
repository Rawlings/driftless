import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, ChevronsDown, ChevronsUp, Circle, Copy, Eye, EyeOff, Hand, Lock, Move, Scaling, Slash, Square, Trash2, Type, Unlock } from 'lucide-react'
import { EDITOR_TOOLS, isShapeTool, type EditorToolId } from '../../core/tools'
import { useEditorCommands, useEditorData } from '../state/EditorContext'
import { cn, uiTokens } from '../ui/tokens'

const TOOL_ICONS: Record<EditorToolId, ReactNode> = {
  move: <Move className="h-5 w-5" aria-hidden="true" />,
  hand: <Hand className="h-5 w-5" aria-hidden="true" />,
  scale: <Scaling className="h-5 w-5" aria-hidden="true" />,
  square: <Square className="h-5 w-5" aria-hidden="true" />,
  circle: <Circle className="h-5 w-5" aria-hidden="true" />,
  line: <Slash className="h-5 w-5" aria-hidden="true" />,
  text: <Type className="h-5 w-5" aria-hidden="true" />
}

const TOOL_DESCRIPTIONS: Record<EditorToolId, string> = {
  move: 'Select and move elements',
  hand: 'Pan the canvas viewport',
  scale: 'Resize selected elements',
  square: 'Draw a rectangle',
  circle: 'Draw an ellipse',
  line: 'Draw a line',
  text: 'Create and edit text'
}

interface ToolbarButtonProps {
  label: string
  description: string
  disabled?: boolean
  className: string
  onClick: () => void
  children: ReactNode
}

function ToolbarButton({
  label,
  description,
  disabled,
  className,
  onClick,
  children
}: ToolbarButtonProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        className={className}
        onClick={onClick}
      >
        {children}
      </button>

      <div className={uiTokens.tooltip.wrapper}>
        <div className={uiTokens.tooltip.panel}>
          <span className={uiTokens.tooltip.title}>{label}</span>
          <p className={uiTokens.tooltip.description}>{description}</p>
        </div>
      </div>
    </div>
  )
}

const SHAPE_TOOL_LIST = EDITOR_TOOLS.filter((t) => t.family === 'shape')
const NAV_TOOL_LIST = EDITOR_TOOLS.filter((t) => t.family === 'navigation')

function isNavigationTool(tool: EditorToolId): tool is 'move' | 'hand' | 'scale' {
  return tool === 'move' || tool === 'hand' || tool === 'scale'
}

function NavigationDropdownButton() {
  const { activeTool } = useEditorData()
  const { setActiveTool } = useEditorCommands()
  const [open, setOpen] = useState(false)
  const [lastNav, setLastNav] = useState<'move' | 'hand' | 'scale'>('move')
  const containerRef = useRef<HTMLDivElement>(null)

  const currentNav = isNavigationTool(activeTool) ? activeTool : lastNav
  const isActive = isNavigationTool(activeTool)
  const currentTool = EDITOR_TOOLS.find((t) => t.id === currentNav)!

  useEffect(() => {
    if (isNavigationTool(activeTool)) setLastNav(activeTool)
  }, [activeTool])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const buttonClass = isActive
    ? cn(uiTokens.control.iconButtonToolbar, uiTokens.motion.control, uiTokens.focus.ring, uiTokens.control.iconButtonInteractive, uiTokens.control.toolbarSelected)
    : cn(uiTokens.control.iconButtonToolbar, uiTokens.motion.control, uiTokens.focus.ring, uiTokens.control.iconButtonInteractive, uiTokens.control.toolbarIdle)

  return (
    <div ref={containerRef} className="group relative">
      {open && (
        <div className="pointer-events-auto absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2">
          <div className={cn(uiTokens.tooltip.panel, 'flex min-w-[148px] flex-col gap-0.5 p-1')}>
            {NAV_TOOL_LIST.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => {
                  setActiveTool(tool.id)
                  setLastNav(tool.id as 'move' | 'hand' | 'scale')
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm outline-none',
                  uiTokens.motion.control,
                  tool.id === currentNav
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {TOOL_ICONS[tool.id as EditorToolId]}
                </span>
                <span className="flex-1 text-left font-medium">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={`${currentTool.label} navigation tool`}
        className={buttonClass}
        onClick={() => {
          setActiveTool(currentNav)
          setOpen(false)
        }}
      >
        {TOOL_ICONS[currentNav]}
      </button>

      <button
        type="button"
        aria-label="Switch navigation tool"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className="absolute -bottom-1 -right-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 outline-none hover:border-blue-400 hover:text-blue-600"
      >
        <ChevronDown className="h-2.5 w-2.5" />
      </button>

      {!open && (
        <div className={uiTokens.tooltip.wrapper}>
          <div className={uiTokens.tooltip.panel}>
            <span className={uiTokens.tooltip.title}>{currentTool.label}</span>
            <p className={uiTokens.tooltip.description}>{TOOL_DESCRIPTIONS[currentTool.id]}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ShapeDropdownButton() {
  const { activeTool } = useEditorData()
  const { setActiveTool } = useEditorCommands()
  const [open, setOpen] = useState(false)
  const [lastShape, setLastShape] = useState<'square' | 'circle' | 'line'>('square')
  const containerRef = useRef<HTMLDivElement>(null)

  const currentShape = isShapeTool(activeTool) ? activeTool : lastShape
  const isActive = isShapeTool(activeTool)
  const currentTool = EDITOR_TOOLS.find((t) => t.id === currentShape)!

  useEffect(() => {
    if (isShapeTool(activeTool)) setLastShape(activeTool)
  }, [activeTool])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const buttonClass = isActive
    ? cn(uiTokens.control.iconButtonToolbar, uiTokens.motion.control, uiTokens.focus.ring, uiTokens.control.iconButtonInteractive, uiTokens.control.toolbarSelected)
    : cn(uiTokens.control.iconButtonToolbar, uiTokens.motion.control, uiTokens.focus.ring, uiTokens.control.iconButtonInteractive, uiTokens.control.toolbarIdle)

  return (
    <div ref={containerRef} className="group relative">
      {/* Shape picker dropdown */}
      {open && (
        <div className="pointer-events-auto absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2">
          <div className={cn(uiTokens.tooltip.panel, 'flex min-w-[148px] flex-col gap-0.5 p-1')}>
            {SHAPE_TOOL_LIST.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => {
                  setActiveTool(tool.id)
                  setLastShape(tool.id as 'square' | 'circle' | 'line')
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm outline-none',
                  uiTokens.motion.control,
                  tool.id === currentShape
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {TOOL_ICONS[tool.id as EditorToolId]}
                </span>
                <span className="flex-1 text-left font-medium">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main tool activation button */}
      <button
        type="button"
        aria-label={`${currentTool.label} tool`}
        className={buttonClass}
        onClick={() => {
          setActiveTool(currentShape)
          setOpen(false)
        }}
      >
        {TOOL_ICONS[currentShape]}
      </button>

      {/* Chevron trigger badge */}
      <button
        type="button"
        aria-label="Switch shape type"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className="absolute -bottom-1 -right-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 outline-none hover:border-blue-400 hover:text-blue-600"
      >
        <ChevronDown className="h-2.5 w-2.5" />
      </button>

      {/* Tooltip — suppressed while dropdown is open */}
      {!open && (
        <div className={uiTokens.tooltip.wrapper}>
          <div className={uiTokens.tooltip.panel}>
            <span className={uiTokens.tooltip.title}>{currentTool.label}</span>
            <p className={uiTokens.tooltip.description}>Draw a shape. Click ▾ to switch type.</p>
          </div>
        </div>
      )}
    </div>
  )
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

  const toolBtnClass = (id: EditorToolId) =>
    activeTool === id
      ? cn(uiTokens.control.iconButtonToolbar, uiTokens.motion.control, uiTokens.focus.ring, uiTokens.control.iconButtonInteractive, uiTokens.control.toolbarSelected)
      : cn(uiTokens.control.iconButtonToolbar, uiTokens.motion.control, uiTokens.focus.ring, uiTokens.control.iconButtonInteractive, uiTokens.control.toolbarIdle)

  return (
    <div className={cn('fixed bottom-4 left-1/2 z-40 -translate-x-1/2', uiTokens.shell.toolbar, uiTokens.motion.panel, 'hover:shadow-xl')}>
      <div className="flex items-center gap-2">
        {/* Navigation tools — consolidated dropdown */}
        <NavigationDropdownButton />

        <div className="mx-1 h-8 w-px bg-slate-200" aria-hidden="true" />

        {/* Shape tool — consolidated dropdown */}
        <ShapeDropdownButton />

        {/* Text tool */}
        <ToolbarButton
          label="Text Tool"
          description={TOOL_DESCRIPTIONS.text}
          className={toolBtnClass('text')}
          onClick={() => setActiveTool('text')}
        >
          {TOOL_ICONS.text}
        </ToolbarButton>

        <div className="mx-1 h-8 w-px bg-slate-200" aria-hidden="true" />

        <ToolbarButton
          label="Bring To Front"
          description="Move selected element to the top layer"
          disabled={!hasSelection}
          className={cn(
            uiTokens.control.iconButtonToolbar,
            uiTokens.motion.control,
            uiTokens.focus.ring,
            uiTokens.control.iconButtonInteractive,
            !hasSelection && 'cursor-not-allowed opacity-40 hover:border-slate-200 hover:bg-white hover:text-slate-700'
          )}
          onClick={() => selectedId && moveElementLayer(selectedId, 'front')}
        >
          <ChevronsUp className="h-5 w-5" aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          label="Send To Back"
          description="Move selected element to the bottom layer"
          disabled={!hasSelection}
          className={cn(
            uiTokens.control.iconButtonToolbar,
            uiTokens.motion.control,
            uiTokens.focus.ring,
            uiTokens.control.iconButtonInteractive,
            !hasSelection && 'cursor-not-allowed opacity-40 hover:border-slate-200 hover:bg-white hover:text-slate-700'
          )}
          onClick={() => selectedId && moveElementLayer(selectedId, 'back')}
        >
          <ChevronsDown className="h-5 w-5" aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          label={isLocked ? 'Unlock Element' : 'Lock Element'}
          description={isLocked ? 'Unlock selected element for editing' : 'Prevent moving and resizing selected element'}
          disabled={!hasSelection}
          className={cn(
            uiTokens.control.iconButtonToolbar,
            uiTokens.motion.control,
            uiTokens.focus.ring,
            uiTokens.control.iconButtonInteractive,
            isLocked && uiTokens.control.toolbarSelected,
            !hasSelection && 'cursor-not-allowed opacity-40 hover:border-slate-200 hover:bg-white hover:text-slate-700'
          )}
          onClick={() => toggleSelectedLock()}
        >
          {isLocked ? <Lock className="h-5 w-5" aria-hidden="true" /> : <Unlock className="h-5 w-5" aria-hidden="true" />}
        </ToolbarButton>

        <ToolbarButton
          label={isHidden ? 'Show Element' : 'Hide Element'}
          description={isHidden ? 'Make selected element visible again' : 'Temporarily hide selected element'}
          disabled={!hasSelection}
          className={cn(
            uiTokens.control.iconButtonToolbar,
            uiTokens.motion.control,
            uiTokens.focus.ring,
            uiTokens.control.iconButtonInteractive,
            isHidden && uiTokens.control.toolbarSelected,
            !hasSelection && 'cursor-not-allowed opacity-40 hover:border-slate-200 hover:bg-white hover:text-slate-700'
          )}
          onClick={() => toggleSelectedVisibility()}
        >
          {isHidden ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
        </ToolbarButton>

        <ToolbarButton
          label="Duplicate"
          description="Duplicate selected element with offset"
          disabled={!hasSelection}
          className={cn(
            uiTokens.control.iconButtonToolbar,
            uiTokens.motion.control,
            uiTokens.focus.ring,
            uiTokens.control.iconButtonInteractive,
            !hasSelection && 'cursor-not-allowed opacity-40 hover:border-slate-200 hover:bg-white hover:text-slate-700'
          )}
          onClick={() => duplicateSelectedElement()}
        >
          <Copy className="h-5 w-5" aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          label="Delete"
          description="Delete selected element and its children"
          disabled={!hasSelection}
          className={cn(
            uiTokens.control.iconButtonToolbar,
            uiTokens.motion.control,
            uiTokens.focus.ring,
            uiTokens.control.iconButtonInteractive,
            'hover:border-red-300 hover:bg-red-50 hover:text-red-700',
            !hasSelection && 'cursor-not-allowed opacity-40 hover:border-slate-200 hover:bg-white hover:text-slate-700'
          )}
          onClick={() => deleteSelectedElement()}
        >
          <Trash2 className="h-5 w-5" aria-hidden="true" />
        </ToolbarButton>
      </div>
    </div>
  )
}