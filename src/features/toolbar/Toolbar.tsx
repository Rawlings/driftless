import { useMemo } from 'react'
import { Button } from 'primereact/button'
import { Toolbar as PrimeToolbar } from 'primereact/toolbar'
import { useEditorCommands, useEditorData } from '../state/EditorContext'

const TOOL_ICONS = {
  move: 'pi pi-arrows-alt',
  hand: 'pi pi-compass',
  scale: 'pi pi-expand',
  square: 'pi pi-stop',
  circle: 'pi pi-circle',
  line: 'pi pi-minus',
  text: 'pi pi-pencil'
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
      icon: string
      onClick: () => void
      disabled?: boolean
      selected?: boolean
      danger?: boolean
    }) => {
      const { ariaLabel, icon, onClick, disabled = false, selected = false, danger = false } = options

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
          onClick={onClick}
        />
      )
    }

    return (
      <div className="flex items-center gap-2">
        {button({ ariaLabel: 'Move Tool', icon: TOOL_ICONS.move, selected: activeTool === 'move', onClick: () => setActiveTool('move') })}
        {button({ ariaLabel: 'Hand Tool', icon: TOOL_ICONS.hand, selected: activeTool === 'hand', onClick: () => setActiveTool('hand') })}
        {button({ ariaLabel: 'Scale Tool', icon: TOOL_ICONS.scale, selected: activeTool === 'scale', onClick: () => setActiveTool('scale') })}
        {button({ ariaLabel: 'Square Tool', icon: TOOL_ICONS.square, selected: activeTool === 'square', onClick: () => setActiveTool('square') })}
        {button({ ariaLabel: 'Circle Tool', icon: TOOL_ICONS.circle, selected: activeTool === 'circle', onClick: () => setActiveTool('circle') })}
        {button({ ariaLabel: 'Line Tool', icon: TOOL_ICONS.line, selected: activeTool === 'line', onClick: () => setActiveTool('line') })}
        {button({ ariaLabel: 'Text Tool', icon: TOOL_ICONS.text, selected: activeTool === 'text', onClick: () => setActiveTool('text') })}
        <span className="mx-1 h-8 w-px bg-surface-300" aria-hidden="true" />
        {button({ ariaLabel: 'Bring To Front', icon: 'pi pi-angle-double-up', disabled: !hasSelection, onClick: () => selectedId && moveElementLayer(selectedId, 'front') })}
        {button({ ariaLabel: 'Send To Back', icon: 'pi pi-angle-double-down', disabled: !hasSelection, onClick: () => selectedId && moveElementLayer(selectedId, 'back') })}
        {button({ ariaLabel: isLocked ? 'Unlock Element' : 'Lock Element', icon: isLocked ? 'pi pi-lock' : 'pi pi-lock-open', selected: isLocked, disabled: !hasSelection, onClick: () => toggleSelectedLock() })}
        {button({ ariaLabel: isHidden ? 'Show Element' : 'Hide Element', icon: isHidden ? 'pi pi-eye-slash' : 'pi pi-eye', selected: isHidden, disabled: !hasSelection, onClick: () => toggleSelectedVisibility() })}
        {button({ ariaLabel: 'Duplicate', icon: 'pi pi-copy', disabled: !hasSelection, onClick: () => duplicateSelectedElement() })}
        {button({ ariaLabel: 'Delete', icon: 'pi pi-trash', danger: true, disabled: !hasSelection, onClick: () => deleteSelectedElement() })}
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
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-slate-300 bg-slate-100 px-2 py-2"
      start={startContent}
    />
  )
}
