/**
 * Error Handling Utilities
 * Provides type-safe error parsing and user-friendly error messages
 */

import type { ApiError } from '../types/api'

/**
 * Check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error
  )
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (isApiError(error)) {
    return error.code === 'rate_limit_exceeded' || error.code === 'too_many_requests'
  }

  if (error instanceof Error) {
    return (
      error.message.toLowerCase().includes('rate limit') ||
      error.message.toLowerCase().includes('too many requests')
    )
  }

  return false
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.name === 'NetworkError' ||
      error.message.toLowerCase().includes('network') ||
      error.message.toLowerCase().includes('fetch failed') ||
      error.message.toLowerCase().includes('connection')
    )
  }

  return false
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (isApiError(error)) {
    return (
      error.code === 'unauthorized' ||
      error.code === 'invalid_api_key' ||
      error.code === 'authentication_failed'
    )
  }

  if (error instanceof Error) {
    return (
      error.message.toLowerCase().includes('unauthorized') ||
      error.message.toLowerCase().includes('authentication')
    )
  }

  return false
}

/**
 * Parse an API error and return a structured ApiError object
 */
export function parseApiError(error: unknown): ApiError {
  // Already an ApiError
  if (isApiError(error)) {
    return error
  }

  // Standard Error object
  if (error instanceof Error) {
    return {
      message: error.message,
      code: error.name === 'AbortError' ? 'request_aborted' : 'unknown_error',
      retryable: error.name !== 'AbortError',
    }
  }

  // Response object with status
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number'
  ) {
    const status = error.status

    if (status === 429) {
      return {
        message: 'Too many requests. Please try again in a moment.',
        code: 'rate_limit_exceeded',
        retryable: true,
      }
    }

    if (status === 401 || status === 403) {
      return {
        message: 'Authentication failed. Please check your API key.',
        code: 'unauthorized',
        retryable: false,
      }
    }

    if (status >= 500) {
      return {
        message: 'Server error. Please try again later.',
        code: 'server_error',
        retryable: true,
      }
    }

    if (status >= 400) {
      return {
        message: 'Bad request. Please check your input.',
        code: 'bad_request',
        retryable: false,
      }
    }
  }

  // Unknown error
  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'unknown_error',
    retryable: true,
  }
}

/**
 * Get a user-friendly error message from any error type
 * This sanitizes technical errors into readable messages
 */
export function getErrorMessage(error: unknown): string {
  // Parse error into ApiError format
  const apiError = parseApiError(error)

  // Return user-friendly messages based on error code
  switch (apiError.code) {
    case 'rate_limit_exceeded':
    case 'too_many_requests':
      return 'You have exceeded the rate limit. Please wait a moment before trying again.'

    case 'unauthorized':
    case 'invalid_api_key':
    case 'authentication_failed':
      return 'Authentication failed. Please check your API key in the environment variables.'

    case 'request_aborted':
      return 'Request was cancelled.'

    case 'server_error':
      return 'Our servers are experiencing issues. Please try again in a few moments.'

    case 'bad_request':
      return 'Invalid request. Please check your input and try again.'

    case 'network_error':
      return 'Network connection failed. Please check your internet connection.'

    case 'timeout':
      return 'Request timed out. Please try again.'

    default:
      // Return the message from ApiError, which has already been sanitized
      return apiError.message || 'An unexpected error occurred. Please try again.'
  }
}

/**
 * Log error for debugging (can be extended to send to error tracking service)
 */
export function logError(error: unknown, context?: string): void {
  const apiError = parseApiError(error)

  console.error('[Error]', {
    context,
    code: apiError.code,
    message: apiError.message,
    retryable: apiError.retryable,
    originalError: error,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Format error for display with optional context
 */
export function formatErrorDisplay(error: unknown, action?: string): string {
  const message = getErrorMessage(error)

  if (action) {
    return `Failed to ${action}: ${message}`
  }

  return message
}
