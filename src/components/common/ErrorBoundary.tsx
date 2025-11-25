import { Component, ReactNode } from 'react'
import { logError } from '../../utils/errorHandling'
import './ErrorBoundary.css'

export interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode
  /** Optional fallback UI to render on error */
  fallback?: ReactNode
  /** Optional callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Optional context name for logging */
  context?: string
}

interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean
  /** The caught error */
  error: Error | null
  /** Additional error information */
  errorInfo: React.ErrorInfo | null
}

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  /**
   * Log error information
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { onError, context } = this.props

    // Log error for debugging
    logError(error, context || 'ErrorBoundary')

    // Also log component stack
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack)

    // Update state with error info
    this.setState({ errorInfo })

    // Call optional error callback
    if (onError) {
      onError(error, errorInfo)
    }
  }

  /**
   * Reset error state
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  /**
   * Reload the page
   */
  handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon" aria-hidden="true">
              ⚠️
            </div>
            <h1 className="error-boundary-title">Something went wrong</h1>
            <p className="error-boundary-message">
              An unexpected error occurred. You can try to recover by clicking the button below.
            </p>

            {error && (
              <details className="error-boundary-details">
                <summary className="error-boundary-details-summary">Error details</summary>
                <div className="error-boundary-details-content">
                  <p className="error-boundary-error-name">{error.name}</p>
                  <p className="error-boundary-error-message">{error.message}</p>
                  {error.stack && (
                    <pre className="error-boundary-stack">{error.stack}</pre>
                  )}
                  {errorInfo && (
                    <pre className="error-boundary-component-stack">
                      {errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="error-boundary-actions">
              <button
                type="button"
                onClick={this.handleReset}
                className="error-boundary-button error-boundary-button--primary"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="error-boundary-button error-boundary-button--secondary"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return children
  }
}
