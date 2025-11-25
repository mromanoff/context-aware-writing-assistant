import { useState, useCallback, useEffect, useRef } from 'react'
import { useWritingMode } from './useWritingMode'
import { useOpenAI } from './useOpenAI'
import type { WritingSuggestion } from '../types/api'

/**
 * Hook options
 */
export interface UseSuggestionsOptions {
  /** Debounce delay in milliseconds */
  debounceMs?: number
  /** Minimum text length to trigger suggestions */
  minTextLength?: number
  /** Auto-fetch suggestions on text change */
  autoFetch?: boolean
}

/**
 * Hook return type
 */
export interface UseSuggestionsReturn {
  /** Current suggestions */
  suggestions: WritingSuggestion[]
  /** Loading state */
  loading: boolean
  /** Error state */
  error: import('../types/api').ApiError | null
  /** Fetch suggestions for text */
  fetchSuggestions: (text: string) => Promise<void>
  /** Apply a suggestion */
  applySuggestion: (suggestion: WritingSuggestion, currentText: string) => string
  /** Dismiss a suggestion */
  dismissSuggestion: (suggestion: WritingSuggestion) => void
  /** Clear all suggestions */
  clearSuggestions: () => void
  /** Retry fetching after error */
  retry: () => void
}

const DEFAULT_OPTIONS: UseSuggestionsOptions = {
  debounceMs: 3000, // 3 seconds
  minTextLength: 100, // Minimum 100 characters
  autoFetch: false,
}

/**
 * Custom hook for managing writing suggestions
 * Integrates with OpenAI service and provides suggestion management
 */
export function useSuggestions(
  options: UseSuggestionsOptions = {}
): UseSuggestionsReturn {
  const config = { ...DEFAULT_OPTIONS, ...options }
  const { currentMode, text } = useWritingMode()
  const { fetchSuggestions: fetchFromAPI, suggestions: apiSuggestions, loading, error } = useOpenAI()

  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([])
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const lastTextRef = useRef<string>('')
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Update local suggestions when API returns new ones
  useEffect(() => {
    if (apiSuggestions.length > 0) {
      setSuggestions(apiSuggestions)
    }
  }, [apiSuggestions])

  /**
   * Fetch suggestions from API
   */
  const fetchSuggestions = useCallback(
    async (text: string) => {
      // Validate text length
      if (!text || text.trim().length < config.minTextLength!) {
        setSuggestions([])
        return
      }

      // Don't refetch if text hasn't changed
      if (text === lastTextRef.current) {
        return
      }

      lastTextRef.current = text

      try {
        await fetchFromAPI(text, currentMode)
        // Suggestions will be updated via useEffect watching apiSuggestions
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
      }
    },
    [currentMode, fetchFromAPI, config.minTextLength]
  )

  /**
   * Debounced fetch
   */
  const debouncedFetch = useCallback(
    (text: string): Promise<void> => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      return new Promise<void>((resolve) => {
        debounceTimerRef.current = setTimeout(() => {
          fetchSuggestions(text).then(resolve)
        }, config.debounceMs)
      })
    },
    [fetchSuggestions, config.debounceMs]
  )

  /**
   * Dismiss a suggestion
   */
  const dismissSuggestion = useCallback((suggestion: WritingSuggestion) => {
    setDismissedIds((prev) => new Set(prev).add(suggestion.id))
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id))
  }, [])

  /**
   * Apply a suggestion to text
   * Returns the updated text
   */
  const applySuggestion = useCallback(
    (suggestion: WritingSuggestion, currentText: string): string => {
      const { originalText, suggestedText } = suggestion

      if (!suggestedText || !originalText) {
        return currentText
      }

      // Simple replacement (in a real app, you'd use position data)
      const updatedText = currentText.replace(originalText, suggestedText)

      // Dismiss the applied suggestion
      dismissSuggestion(suggestion)

      return updatedText
    },
    [dismissSuggestion]
  )

  /**
   * Clear all suggestions
   */
  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setDismissedIds(new Set())
    lastTextRef.current = ''
  }, [])

  /**
   * Retry fetching
   */
  const retry = useCallback(() => {
    if (lastTextRef.current) {
      fetchSuggestions(lastTextRef.current)
    }
  }, [fetchSuggestions])

  /**
   * Filter out dismissed suggestions
   */
  const filteredSuggestions = suggestions.filter(
    (s) => !dismissedIds.has(s.id)
  )

  /**
   * Sort suggestions by severity
   * error > warning > info > suggestion
   */
  const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
    const severityOrder = { error: 0, warning: 1, info: 2, suggestion: 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

  // Auto-fetch suggestions when text changes
  useEffect(() => {
    if (config.autoFetch && text && text.trim().length >= config.minTextLength!) {
      debouncedFetch(text)
    }
  }, [text, config.autoFetch, config.minTextLength, debouncedFetch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return {
    suggestions: sortedSuggestions,
    loading,
    error,
    fetchSuggestions: config.autoFetch ? debouncedFetch : fetchSuggestions,
    applySuggestion,
    dismissSuggestion,
    clearSuggestions,
    retry,
  }
}
