import { Badge } from '../common'
import type { WritingSuggestion } from '../../types/api'
import './SuggestionCard.css'

export interface SuggestionCardProps {
  /** Suggestion to display */
  suggestion: WritingSuggestion
  /** Callback when suggestion is applied */
  onApply?: (suggestion: WritingSuggestion) => void
  /** Callback when suggestion is dismissed */
  onDismiss?: (suggestion: WritingSuggestion) => void
  /** Whether actions are disabled */
  disabled?: boolean
}

/**
 * Get badge variant based on severity
 */
function getSeverityVariant(severity: WritingSuggestion['severity']) {
  switch (severity) {
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    case 'suggestion':
      return 'neutral'
    default:
      return 'neutral'
  }
}

/**
 * Get category display name
 */
function getCategoryDisplayName(category: WritingSuggestion['category']) {
  const names: Record<WritingSuggestion['category'], string> = {
    grammar: 'Grammar',
    spelling: 'Spelling',
    style: 'Style',
    clarity: 'Clarity',
    conciseness: 'Conciseness',
    tone: 'Tone',
    structure: 'Structure',
  }
  return names[category] || category
}

export function SuggestionCard({
  suggestion,
  onApply,
  onDismiss,
  disabled = false,
}: SuggestionCardProps) {
  const { category, severity, message, originalText, suggestedText, explanation, alternatives } =
    suggestion

  const hasReplacement = !!suggestedText || (alternatives && alternatives.length > 0)

  return (
    <div className={`suggestion-card suggestion-card--${severity}`}>
      {/* Header */}
      <div className="suggestion-card-header">
        <Badge variant={getSeverityVariant(severity)} text={getCategoryDisplayName(category)} />
        <Badge variant="neutral" text={severity} size="small" />
      </div>

      {/* Message */}
      <p className="suggestion-card-message">{message}</p>

      {/* Original Text */}
      {originalText && (
        <div className="suggestion-card-text">
          <span className="suggestion-card-label">Original:</span>
          <code className="suggestion-card-original">{originalText}</code>
        </div>
      )}

      {/* Suggested Text */}
      {suggestedText && (
        <div className="suggestion-card-text">
          <span className="suggestion-card-label">Suggested:</span>
          <code className="suggestion-card-suggested">{suggestedText}</code>
        </div>
      )}

      {/* Alternatives */}
      {alternatives && alternatives.length > 0 && (
        <div className="suggestion-card-alternatives">
          <span className="suggestion-card-label">Alternatives:</span>
          <ul className="suggestion-card-alternatives-list">
            {alternatives.map((alt, index) => (
              <li key={index} className="suggestion-card-alternative">
                <code>{alt}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <details className="suggestion-card-details">
          <summary className="suggestion-card-details-summary">Why this helps</summary>
          <p className="suggestion-card-explanation">{explanation}</p>
        </details>
      )}

      {/* Actions */}
      <div className="suggestion-card-actions">
        {hasReplacement && onApply && (
          <button
            type="button"
            onClick={() => onApply(suggestion)}
            disabled={disabled}
            className="suggestion-card-button suggestion-card-button--apply"
            aria-label={`Apply suggestion: ${message}`}
          >
            Apply
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(suggestion)}
            disabled={disabled}
            className="suggestion-card-button suggestion-card-button--dismiss"
            aria-label={`Dismiss suggestion: ${message}`}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  )
}
