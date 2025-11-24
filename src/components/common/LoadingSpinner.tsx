import { HTMLAttributes } from 'react'
import './LoadingSpinner.css'

export type SpinnerSize = 'small' | 'medium' | 'large'
export type SpinnerColor = 'primary' | 'secondary' | 'white' | 'current'

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner */
  size?: SpinnerSize
  /** Color variant of the spinner */
  color?: SpinnerColor
  /** Accessible label for screen readers */
  label?: string
  /** Whether to center the spinner in its container */
  centered?: boolean
}

export function LoadingSpinner({
  size = 'medium',
  color = 'primary',
  label = 'Loading',
  centered = false,
  className = '',
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={`spinner-container ${centered ? 'spinner-container--centered' : ''} ${className}`}
      role="status"
      aria-live="polite"
      {...props}
    >
      <div className={`spinner spinner--${size} spinner--${color}`}>
        <div className="spinner-circle"></div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}

/* LoadingOverlay component for blocking UI during loading */
export interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  visible: boolean
  /** Message to display */
  message?: string
  /** Size of the spinner */
  size?: SpinnerSize
}

export function LoadingOverlay({
  visible,
  message = 'Loading...',
  size = 'large',
}: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div className="loading-overlay" role="dialog" aria-modal="true" aria-label="Loading">
      <div className="loading-overlay-content">
        <LoadingSpinner size={size} color="white" label={message} />
        {message && <p className="loading-overlay-message">{message}</p>}
      </div>
    </div>
  )
}
