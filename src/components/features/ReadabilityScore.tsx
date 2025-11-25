import './ReadabilityScore.css'

export interface ReadabilityScoreProps {
  /** Readability score from 0-100 (higher = easier to read) */
  score: number
  /** Optional className for custom styling */
  className?: string
}

/**
 * Get readability level label and description
 */
function getReadabilityLevel(score: number): {
  label: string
  description: string
  color: 'green' | 'yellow' | 'orange' | 'red'
} {
  if (score >= 80) {
    return {
      label: 'Very Easy',
      description: '5th-6th grade level',
      color: 'green',
    }
  } else if (score >= 70) {
    return {
      label: 'Easy',
      description: '7th grade level',
      color: 'green',
    }
  } else if (score >= 60) {
    return {
      label: 'Standard',
      description: '8th-9th grade level',
      color: 'yellow',
    }
  } else if (score >= 50) {
    return {
      label: 'Fairly Difficult',
      description: '10th-12th grade level',
      color: 'yellow',
    }
  } else if (score >= 30) {
    return {
      label: 'Difficult',
      description: 'College level',
      color: 'orange',
    }
  } else {
    return {
      label: 'Very Difficult',
      description: 'College graduate level',
      color: 'red',
    }
  }
}

/**
 * ReadabilityScore Component
 * Displays a visual representation of text readability using the Flesch Reading Ease score
 */
export function ReadabilityScore({ score, className = '' }: ReadabilityScoreProps) {
  const level = getReadabilityLevel(score)

  return (
    <div className={`readability-score ${className}`}>
      <div className="readability-score-header">
        <h3 className="readability-score-title">Readability</h3>
        <span
          className="readability-score-value"
          aria-label={`Readability score: ${score} out of 100`}
        >
          {score}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="readability-score-bar"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Readability score: ${score} out of 100, ${level.label}`}
      >
        <div
          className={`readability-score-fill readability-score-fill--${level.color}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Level Info */}
      <div className="readability-score-info">
        <span className={`readability-score-label readability-score-label--${level.color}`}>
          {level.label}
        </span>
        <span className="readability-score-description">{level.description}</span>
      </div>
    </div>
  )
}
