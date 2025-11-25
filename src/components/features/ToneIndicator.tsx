import type { Tone } from '../../utils/textAnalysis'
import type { WritingMode } from '../../types'
import './ToneIndicator.css'

export interface ToneIndicatorProps {
  /** Detected tone of the text */
  tone: Tone
  /** Target tone from writing mode (optional) */
  targetTone?: WritingMode
  /** Optional className for custom styling */
  className?: string
}

/**
 * Get tone display information
 */
function getToneInfo(tone: Tone): {
  label: string
  description: string
  icon: string
} {
  switch (tone) {
    case 'formal':
      return {
        label: 'Formal',
        description: 'Professional and structured',
        icon: '👔',
      }
    case 'casual':
      return {
        label: 'Casual',
        description: 'Relaxed and conversational',
        icon: '😊',
      }
    case 'technical':
      return {
        label: 'Technical',
        description: 'Precise and specialized',
        icon: '⚙️',
      }
    case 'creative':
      return {
        label: 'Creative',
        description: 'Imaginative and expressive',
        icon: '🎨',
      }
    case 'neutral':
      return {
        label: 'Neutral',
        description: 'Balanced and objective',
        icon: '📝',
      }
  }
}

/**
 * Check if detected tone matches the target mode
 */
function toneMatchesMode(tone: Tone, mode?: WritingMode): boolean {
  if (!mode) {
    return false
  }

  // Direct matches
  if (tone === mode) {
    return true
  }

  // Acceptable matches
  const acceptableMatches: Record<WritingMode, Tone[]> = {
    technical: ['technical', 'formal'],
    creative: ['creative', 'casual'],
    business: ['formal', 'neutral'],
    casual: ['casual', 'neutral'],
  }

  return acceptableMatches[mode]?.includes(tone) || false
}

/**
 * ToneIndicator Component
 * Displays the detected tone of the text and indicates if it matches the target writing mode
 */
export function ToneIndicator({ tone, targetTone, className = '' }: ToneIndicatorProps) {
  const toneInfo = getToneInfo(tone)
  const isMatch = toneMatchesMode(tone, targetTone)

  return (
    <div className={`tone-indicator ${className}`}>
      <div className="tone-indicator-header">
        <h3 className="tone-indicator-title">Tone</h3>
        {targetTone && (
          <span
            className={`tone-indicator-match ${
              isMatch ? 'tone-indicator-match--yes' : 'tone-indicator-match--no'
            }`}
            aria-label={isMatch ? 'Tone matches target mode' : 'Tone does not match target mode'}
          >
            {isMatch ? '✓ Match' : '✗ Mismatch'}
          </span>
        )}
      </div>

      <div className="tone-indicator-content">
        <span className="tone-indicator-icon" aria-hidden="true">
          {toneInfo.icon}
        </span>
        <div className="tone-indicator-info">
          <span className={`tone-indicator-label tone-indicator-label--${tone}`}>
            {toneInfo.label}
          </span>
          <span className="tone-indicator-description">{toneInfo.description}</span>
        </div>
      </div>

      {targetTone && !isMatch && (
        <div className="tone-indicator-suggestion">
          <span className="tone-indicator-suggestion-text">
            Target: {targetTone.charAt(0).toUpperCase() + targetTone.slice(1)}
          </span>
        </div>
      )}
    </div>
  )
}
