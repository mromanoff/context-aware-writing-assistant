import { useState } from 'react'
import { SuggestionCard } from './SuggestionCard'
import { ErrorMessage, LoadingSkeletonGroup } from '../common'
import type { WritingSuggestion } from '../../types/api'
import type { ApiError } from '../../types/api'
import './SuggestionsPanel.css'

export interface SuggestionsPanelProps {
  /** Array of suggestions to display */
  suggestions: WritingSuggestion[]
  /** Whether suggestions are loading */
  loading?: boolean
  /** Error state */
  error?: ApiError | null
  /** Callback when suggestion is applied */
  onApply?: (suggestion: WritingSuggestion) => void
  /** Callback when suggestion is dismissed */
  onDismiss?: (suggestion: WritingSuggestion) => void
  /** Callback to retry loading suggestions */
  onRetry?: () => void
  /** Optional className */
  className?: string
}

/**
 * Filter options for suggestions
 */
type FilterOption = 'all' | 'error' | 'warning' | 'info' | 'suggestion'

export function SuggestionsPanel({
  suggestions,
  loading = false,
  error = null,
  onApply,
  onDismiss,
  onRetry,
  className = '',
}: SuggestionsPanelProps) {
  const [filter, setFilter] = useState<FilterOption>('all')

  // Filter suggestions based on severity
  const filteredSuggestions =
    filter === 'all'
      ? suggestions
      : suggestions.filter((s) => s.severity === filter)

  // Count suggestions by severity
  const counts = {
    error: suggestions.filter((s) => s.severity === 'error').length,
    warning: suggestions.filter((s) => s.severity === 'warning').length,
    info: suggestions.filter((s) => s.severity === 'info').length,
    suggestion: suggestions.filter((s) => s.severity === 'suggestion').length,
  }

  const totalCount = suggestions.length

  return (
    <div className={`suggestions-panel ${className}`}>
      {/* Header */}
      <div className="suggestions-panel-header">
        <h2 className="suggestions-panel-title">
          Suggestions
          {totalCount > 0 && (
            <span className="suggestions-panel-count">{totalCount}</span>
          )}
        </h2>

        {/* Filter Tabs */}
        {totalCount > 0 && !loading && (
          <div className="suggestions-panel-filters" role="tablist" aria-label="Filter suggestions">
            <button
              role="tab"
              aria-selected={filter === 'all'}
              aria-controls="suggestions-list"
              onClick={() => setFilter('all')}
              className={`suggestions-panel-filter ${filter === 'all' ? 'suggestions-panel-filter--active' : ''}`}
            >
              All ({totalCount})
            </button>
            {counts.error > 0 && (
              <button
                role="tab"
                aria-selected={filter === 'error'}
                aria-controls="suggestions-list"
                onClick={() => setFilter('error')}
                className={`suggestions-panel-filter ${filter === 'error' ? 'suggestions-panel-filter--active' : ''}`}
              >
                Errors ({counts.error})
              </button>
            )}
            {counts.warning > 0 && (
              <button
                role="tab"
                aria-selected={filter === 'warning'}
                aria-controls="suggestions-list"
                onClick={() => setFilter('warning')}
                className={`suggestions-panel-filter ${filter === 'warning' ? 'suggestions-panel-filter--active' : ''}`}
              >
                Warnings ({counts.warning})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        id="suggestions-list"
        className="suggestions-panel-content"
        role="tabpanel"
        aria-live="polite"
      >
        {/* Loading State */}
        {loading && (
          <div className="suggestions-panel-loading">
            <LoadingSkeletonGroup type="list" count={3} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="suggestions-panel-error">
            <ErrorMessage
              error={error}
              action="load suggestions"
              onRetry={onRetry}
              showRetry={!!onRetry && error.retryable !== false}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && totalCount === 0 && (
          <div className="suggestions-panel-state">
            <span className="suggestions-panel-empty-icon" aria-hidden="true">✨</span>
            <p className="suggestions-panel-state-title">No suggestions yet</p>
            <p className="suggestions-panel-state-text">
              Start writing to receive AI-powered suggestions
            </p>
          </div>
        )}

        {/* No Results for Filter */}
        {!loading && !error && totalCount > 0 && filteredSuggestions.length === 0 && (
          <div className="suggestions-panel-state">
            <p className="suggestions-panel-state-text">
              No {filter} suggestions found
            </p>
          </div>
        )}

        {/* Suggestions List */}
        {!loading && !error && filteredSuggestions.length > 0 && (
          <div className="suggestions-panel-list">
            {filteredSuggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onApply={onApply}
                onDismiss={onDismiss}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
