import type { MouseEvent, ReactNode } from 'react'
import { Button } from 'primereact/button'

interface IconActionButtonProps {
  ariaLabel: string
  icon: ReactNode
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  selected?: boolean
  danger?: boolean
  tooltip?: string
  compact?: boolean
  chromeless?: boolean
  className?: string
}

export function IconActionButton({
  ariaLabel,
  icon,
  onClick,
  disabled = false,
  selected = false,
  danger = false,
  tooltip,
  compact = false,
  chromeless = false,
  className,
}: IconActionButtonProps) {
  const sizeClass = compact ? 'h-6 w-6 p-0' : 'h-11 w-11'

  return (
    <Button
      type="button"
      aria-label={ariaLabel}
      icon={icon}
      disabled={disabled}
      rounded
      text={chromeless}
      outlined={chromeless ? false : !selected}
      severity={chromeless ? undefined : danger ? 'danger' : 'secondary'}
      className={className ? `${sizeClass} ${className}` : sizeClass}
      tooltip={tooltip ?? ariaLabel}
      tooltipOptions={{ position: 'top', showDelay: 120 }}
      onClick={onClick}
    />
  )
}
