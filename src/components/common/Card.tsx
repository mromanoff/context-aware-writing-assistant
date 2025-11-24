import { HTMLAttributes, forwardRef } from 'react'
import './Card.css'

export type CardVariant = 'elevated' | 'outlined' | 'flat'
export type CardPadding = 'none' | 'small' | 'medium' | 'large'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: CardVariant
  /** Padding size */
  padding?: CardPadding
  /** Whether the card is interactive (shows hover effect) */
  interactive?: boolean
  /** Whether the card is disabled */
  disabled?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      padding = 'medium',
      interactive = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`card card--${variant} card--padding-${padding} ${interactive ? 'card--interactive' : ''} ${disabled ? 'card--disabled' : ''} ${className}`}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/* Card Header Component */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Title for the card */
  title?: string
  /** Subtitle or description */
  subtitle?: string
  /** Action element (usually buttons) */
  action?: React.ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`card-header ${className}`} {...props}>
        <div className="card-header-content">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
          {children}
        </div>
        {action && <div className="card-header-action">{action}</div>}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

/* Card Body Component */
export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`card-body ${className}`} {...props}>
        {children}
      </div>
    )
  }
)

CardBody.displayName = 'CardBody'

/* Card Footer Component */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Align content to the end (right) */
  alignEnd?: boolean
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ alignEnd = false, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card-footer ${alignEnd ? 'card-footer--end' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'
