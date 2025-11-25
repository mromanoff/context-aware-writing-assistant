import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ToastProps, ToastType } from '../components/common'

// Generate unique ID for toasts
let toastId = 0
const generateToastId = () => `toast-${++toastId}`

interface ToastContextValue {
  toasts: ToastProps[]
  showToast: (message: string, type?: ToastType, duration?: number) => string
  showSuccess: (message: string, duration?: number) => string
  showError: (message: string, duration?: number) => string
  showInfo: (message: string, duration?: number) => string
  showWarning: (message: string, duration?: number) => string
  dismissToast: (id: string) => void
  clearAllToasts: () => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export interface ToastProviderProps {
  children: ReactNode
}

/**
 * ToastProvider Component
 * Provides toast notification management to the app
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000): string => {
      const id = generateToastId()
      const newToast: ToastProps = {
        id,
        message,
        type,
        duration,
        onDismiss: (toastId: string) => dismissToast(toastId),
      }

      setToasts((prev) => [...prev, newToast])
      return id
    },
    []
  )

  const showSuccess = useCallback(
    (message: string, duration: number = 3000): string => {
      return showToast(message, 'success', duration)
    },
    [showToast]
  )

  const showError = useCallback(
    (message: string, duration: number = 5000): string => {
      return showToast(message, 'error', duration)
    },
    [showToast]
  )

  const showInfo = useCallback(
    (message: string, duration: number = 3000): string => {
      return showToast(message, 'info', duration)
    },
    [showToast]
  )

  const showWarning = useCallback(
    (message: string, duration: number = 4000): string => {
      return showToast(message, 'warning', duration)
    },
    [showToast]
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  const value: ToastContextValue = {
    toasts,
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    dismissToast,
    clearAllToasts,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

/**
 * useToast Hook
 * Access toast notification methods
 *
 * @returns Toast context methods
 * @throws Error if used outside ToastProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { showSuccess, showError } = useToast()
 *
 *   const handleSave = () => {
 *     try {
 *       // Save logic
 *       showSuccess('Document saved!')
 *     } catch (error) {
 *       showError('Failed to save document')
 *     }
 *   }
 * }
 * ```
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

export type { ToastContextValue }
