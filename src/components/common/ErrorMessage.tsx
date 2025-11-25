import { getErrorMessage, isRateLimitError, isAuthError } from '../../utils/errorHandling'
import './ErrorMessage.css'

export interface ErrorMessageProps {
  /** Error object to display */
  error: Error | unknown
  /** Optional action that failed (e.g., "load suggestions") */
  action?: string
  /** Callback to retry the failed action */
  onRetry?: () => void
  /** Whether retry button should be shown */
  showRetry?: boolean
  /** Optional className for custom styling */
  className?: string
  /** Size variant */
  size?: 'small' | 'medium' | 'large'
}

/**
 * Get error icon based on error type
 */
function getErrorIcon(error: unknown): string {
  if (isRateLimitError(error)) {
    return '⏱️'
  }

  if (isAuthError(error)) {
    return '🔒'
  }

  return '⚠️'
}

/**
 * ErrorMessage Component
 * Displays user-friendly error messages with optional retry functionality
 */
export function ErrorMessage({
  error,
  action,
  onRetry,
  showRetry = true,
  className = '',
  size = 'medium',
}: ErrorMessageProps) {
  const message = getErrorMessage(error)
  const icon = getErrorIcon(error)
  const canRetry = showRetry && onRetry && !isAuthError(error)

  return (
    <div
      className={`error-message error-message--${size} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="error-message-content">
        <span className="error-message-icon" aria-hidden="true">
          {icon}
        </span>
        <div className="error-message-text">
          <p className="error-message-title">
            {action ? `Failed to ${action}` : 'Error'}
          </p>
          <p className="error-message-description">{message}</p>
        </div>
      </div>

      {canRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="error-message-retry"
          aria-label="Retry action"
        >
          Try Again
        </button>
      )}

      {isAuthError(error) && (
        <div className="error-message-help">
          <p className="error-message-help-text">
            Make sure your <code>VITE_OPENAI_API_KEY</code> is set in your <code>.env</code> file.
          </p>
        </div>
      )}
    </div>
  )
}
