import { ButtonHTMLAttributes, forwardRef } from 'react'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual style variant */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** Whether the button is in a loading state */
  loading?: boolean
  /** Whether the button is disabled */
  disabled?: boolean
  /** Icon to display before the button text */
  startIcon?: React.ReactNode
  /** Icon to display after the button text */
  endIcon?: React.ReactNode
  /** Full width button */
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      disabled = false,
      startIcon,
      endIcon,
      fullWidth = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={`button button--${variant} button--${size} ${fullWidth ? 'button--full-width' : ''} ${className}`}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <span className="button-spinner" aria-hidden="true"></span>
            <span className="button-content button-content--loading">{children}</span>
          </>
        ) : (
          <>
            {startIcon && <span className="button-icon button-icon--start">{startIcon}</span>}
            <span className="button-content">{children}</span>
            {endIcon && <span className="button-icon button-icon--end">{endIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
