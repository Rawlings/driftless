import { useMemo, useRef } from 'react'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import type { MenuItem } from 'primereact/menuitem'
import { ZoomIn } from 'lucide-react'

const ZOOM_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2]

interface ZoomMenuButtonProps {
  viewportScale: number
  setViewportScale: (scale: number) => void
}

export function ZoomMenuButton({ viewportScale, setViewportScale }: ZoomMenuButtonProps) {
  const zoomMenuRef = useRef<Menu>(null)
  const zoomLabel = `${Math.round(viewportScale * 100)}%`

  const zoomMenuItems = useMemo<MenuItem[]>(() => {
    return [
      ...ZOOM_PRESETS.map((preset) => {
        const isActivePreset = Math.abs(viewportScale - preset) < 0.001
        return {
          label: `${Math.round(preset * 100)}%`,
          icon: isActivePreset ? 'pi pi-check' : undefined,
          command: () => setViewportScale(preset)
        }
      }),
      { separator: true },
      {
        label: 'Reset to 100%',
        command: () => setViewportScale(1)
      }
    ]
  }, [setViewportScale, viewportScale])

  return (
    <div className="flex items-center">
      <Button
        type="button"
        rounded
        outlined
        severity="secondary"
        aria-label={`Zoom options, current zoom ${zoomLabel}`}
        className="h-12 w-12"
        icon={(
          <span className="inline-flex flex-col items-center justify-center gap-0.5 leading-none">
            <ZoomIn size={20} strokeWidth={1.75} aria-hidden="true" />
            <span className="pointer-events-none text-[10px] font-semibold text-[var(--text-color-secondary)]">
              {zoomLabel}
            </span>
          </span>
        )}
        onClick={(event) => zoomMenuRef.current?.toggle(event)}
      />
      <Menu id="toolbar-zoom-menu" model={zoomMenuItems} popup ref={zoomMenuRef} />
    </div>
  )
}
