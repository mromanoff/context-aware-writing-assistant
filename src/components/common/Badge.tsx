import { HTMLAttributes } from 'react'
import './Badge.css'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'
export type BadgeSize = 'small' | 'medium' | 'large'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Text content of the badge */
  text?: string
  /** Visual variant of the badge */
  variant?: BadgeVariant
  /** Size of the badge */
  size?: BadgeSize
  /** Whether to show a dot indicator */
  dot?: boolean
  /** Icon to display before the text */
  icon?: React.ReactNode
  /** Whether the badge should be rounded (pill shape) */
  rounded?: boolean
}

export function Badge({
  text,
  variant = 'neutral',
  size = 'medium',
  dot = false,
  icon,
  rounded = true,
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`badge badge--${variant} badge--${size} ${rounded ? 'badge--rounded' : ''} ${className}`}
      {...props}
    >
      {dot && <span className="badge-dot" aria-hidden="true"></span>}
      {icon && <span className="badge-icon" aria-hidden="true">{icon}</span>}
      {text || children}
    </span>
  )
}

/* Badge Group for displaying multiple badges */
export interface BadgeGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum number of badges to show before truncating */
  max?: number
}

export function BadgeGroup({
  children,
  max,
  className = '',
  ...props
}: BadgeGroupProps) {
  const childrenArray = Array.isArray(children) ? children : [children]
  const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray
  const hiddenCount = max && childrenArray.length > max ? childrenArray.length - max : 0

  return (
    <div className={`badge-group ${className}`} {...props}>
      {visibleChildren}
      {hiddenCount > 0 && (
        <Badge variant="neutral" text={`+${hiddenCount}`} size="small" />
      )}
    </div>
  )
}
