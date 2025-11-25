import { useEffect } from 'react'
import './Toast.css'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastProps {
  /** Unique ID for the toast */
  id: string
  /** Toast message */
  message: string
  /** Toast type/severity */
  type?: ToastType
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
  duration?: number
  /** Callback when toast is dismissed */
  onDismiss?: (id: string) => void
  /** Optional className */
  className?: string
}

/**
 * Toast Component
 * Displays temporary notification messages with auto-dismiss
 */
export function Toast({
  id,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  className = '',
}: ToastProps) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onDismiss])

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(id)
    }
  }

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
      default:
        return 'ℹ'
    }
  }

  return (
    <div
      className={`toast toast--${type} animate-slide-in-top ${className}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <span className="toast-icon" aria-hidden="true">
        {getIcon()}
      </span>
      <span className="toast-message">{message}</span>
      <button
        type="button"
        onClick={handleDismiss}
        className="toast-dismiss"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )
}

export interface ToastContainerProps {
  /** Array of toasts to display */
  toasts: ToastProps[]
  /** Position of toast container */
  position?: 'top' | 'bottom'
  /** Optional className */
  className?: string
}

/**
 * ToastContainer Component
 * Stacks multiple toast notifications
 */
export function ToastContainer({
  toasts,
  position = 'top',
  className = '',
}: ToastContainerProps) {
  return (
    <div className={`toast-container toast-container--${position} ${className}`}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
