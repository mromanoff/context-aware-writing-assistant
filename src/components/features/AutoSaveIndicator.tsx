import { useEffect, useState } from 'react'
import './AutoSaveIndicator.css'

export interface AutoSaveIndicatorProps {
  /** Whether currently saving */
  isSaving?: boolean
  /** Last saved timestamp */
  lastSaved?: Date | null
  /** Optional className for custom styling */
  className?: string
}

/**
 * Format time ago in a human-readable format
 */
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 5) {
    return 'just now'
  } else if (diffSec < 60) {
    return `${diffSec}s ago`
  } else if (diffMin < 60) {
    return diffMin === 1 ? '1 min ago' : `${diffMin} mins ago`
  } else if (diffHour < 24) {
    return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`
  } else {
    return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`
  }
}

/**
 * AutoSaveIndicator Component
 * Displays the auto-save status with a subtle, non-intrusive design
 */
export function AutoSaveIndicator({
  isSaving = false,
  lastSaved = null,
  className = '',
}: AutoSaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>('')

  // Update time ago every 5 seconds
  useEffect(() => {
    const updateTimeAgo = () => {
      if (lastSaved) {
        setTimeAgo(formatTimeAgo(lastSaved))
      }
    }

    // Initial update
    updateTimeAgo()

    // Update every 5 seconds
    const interval = setInterval(updateTimeAgo, 5000)

    return () => clearInterval(interval)
  }, [lastSaved])

  // Don't show anything if no lastSaved and not saving
  if (!isSaving && !lastSaved) {
    return null
  }

  return (
    <div className={`auto-save-indicator ${className}`} role="status" aria-live="polite">
      <div className="auto-save-indicator-content">
        {isSaving ? (
          <>
            <span className="auto-save-indicator-spinner" aria-hidden="true" />
            <span className="auto-save-indicator-text">Saving...</span>
          </>
        ) : (
          <>
            <span className="auto-save-indicator-icon" aria-hidden="true">
              ✓
            </span>
            <span className="auto-save-indicator-text">
              Saved {timeAgo}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
