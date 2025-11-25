import { useEffect, useState, useCallback } from 'react'
import './LiveRegion.css'

export interface LiveRegionProps {
  /** Message to announce */
  message: string
  /** Politeness level */
  politeness?: 'polite' | 'assertive'
  /** Whether to clear message after announcement */
  clearAfter?: number
  /** Optional className */
  className?: string
}

/**
 * LiveRegion Component
 * ARIA live region for screen reader announcements
 * Invisible to sighted users but announced to screen reader users
 */
export function LiveRegion({
  message,
  politeness = 'polite',
  clearAfter,
  className = '',
}: LiveRegionProps) {
  const [displayMessage, setDisplayMessage] = useState(message)

  useEffect(() => {
    setDisplayMessage(message)

    if (clearAfter && message) {
      const timer = setTimeout(() => {
        setDisplayMessage('')
      }, clearAfter)

      return () => clearTimeout(timer)
    }
  }, [message, clearAfter])

  return (
    <div
      className={`live-region ${className}`}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
    >
      {displayMessage}
    </div>
  )
}

/**
 * Hook for managing announcements
 * Returns a function to announce messages to screen readers
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const announce = useAnnouncer()
 *
 *   const handleSave = () => {
 *     saveDocument()
 *     announce('Document saved successfully')
 *   }
 * }
 * ```
 */
export function useAnnouncer(): (message: string, politeness?: 'polite' | 'assertive') => void {
  const [announcement, setAnnouncement] = useState<{
    message: string
    politeness: 'polite' | 'assertive'
  } | null>(null)

  useEffect(() => {
    if (announcement) {
      // Clear after announcement
      const timer = setTimeout(() => {
        setAnnouncement(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [announcement])

  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement({ message, politeness })
  }, [])

  return announce
}
