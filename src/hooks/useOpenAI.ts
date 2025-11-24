import { useState, useCallback, useRef, useEffect } from 'react'
import type { WritingMode } from '../types'
import type { AnalysisResult, ApiError, WritingSuggestion } from '../types/api'
import { analyzeText, getSuggestions } from '../services/openai.service'

/**
 * Hook state interface
 */
interface UseOpenAIState {
  /** Current analysis result */
  result: AnalysisResult | null
  /** Current suggestions */
  suggestions: WritingSuggestion[]
  /** Loading state */
  loading: boolean
  /** Error state */
  error: ApiError | null
}

/**
 * Hook return type
 */
interface UseOpenAIReturn extends UseOpenAIState {
  /** Analyze text */
  analyze: (text: string, mode: WritingMode) => Promise<void>
  /** Get suggestions only */
  fetchSuggestions: (text: string, mode: WritingMode) => Promise<void>
  /** Clear error */
  clearError: () => void
  /** Clear all state */
  clear: () => void
}

/**
 * Hook options
 */
interface UseOpenAIOptions {
  /** Debounce delay in milliseconds */
  debounceMs?: number
  /** Minimum text length to trigger analysis */
  minTextLength?: number
  /** Auto-analyze on text change */
  autoAnalyze?: boolean
}

const DEFAULT_OPTIONS: UseOpenAIOptions = {
  debounceMs: 2000, // 2 seconds debounce
  minTextLength: 50, // Minimum 50 characters
  autoAnalyze: false,
}

/**
 * Custom hook for OpenAI API integration
 * Provides text analysis and suggestions with debouncing and error handling
 */
export function useOpenAI(options: UseOpenAIOptions = {}): UseOpenAIReturn {
  const config = { ...DEFAULT_OPTIONS, ...options }

  const [state, setState] = useState<UseOpenAIState>({
    result: null,
    suggestions: [],
    loading: false,
    error: null,
  })

  // Abort controller for canceling requests
  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Clear debounce timer
   */
  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
  }, [])

  /**
   * Abort any ongoing request
   */
  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  /**
   * Clear all state
   */
  const clear = useCallback(() => {
    clearDebounceTimer()
    abortRequest()
    setState({
      result: null,
      suggestions: [],
      loading: false,
      error: null,
    })
  }, [clearDebounceTimer, abortRequest])

  /**
   * Analyze text with OpenAI
   */
  const analyze = useCallback(
    async (text: string, mode: WritingMode) => {
      // Validate text length
      if (text.trim().length < config.minTextLength!) {
        return
      }

      // Cancel any ongoing request
      abortRequest()
      clearDebounceTimer()

      // Set loading state
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        // Create new abort controller
        abortControllerRef.current = new AbortController()

        // Call API
        const result = await analyzeText(text, mode, {
          signal: abortControllerRef.current.signal,
        })

        setState({
          result,
          suggestions: result.suggestions,
          loading: false,
          error: null,
        })
      } catch (error) {
        // Don't set error if request was aborted
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as ApiError,
        }))
      }
    },
    [config.minTextLength, abortRequest, clearDebounceTimer]
  )

  /**
   * Fetch suggestions only (lighter weight than full analysis)
   */
  const fetchSuggestions = useCallback(
    async (text: string, mode: WritingMode) => {
      // Validate text length
      if (text.trim().length < config.minTextLength!) {
        return
      }

      // Cancel any ongoing request
      abortRequest()
      clearDebounceTimer()

      // Set loading state
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        // Create new abort controller
        abortControllerRef.current = new AbortController()

        // Call API
        const suggestions = await getSuggestions(text, mode, {
          signal: abortControllerRef.current.signal,
        })

        setState((prev) => ({
          ...prev,
          suggestions,
          loading: false,
          error: null,
        }))
      } catch (error) {
        // Don't set error if request was aborted
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as ApiError,
        }))
      }
    },
    [config.minTextLength, abortRequest, clearDebounceTimer]
  )

  /**
   * Debounced analyze function
   */
  const debouncedAnalyze = useCallback(
    (text: string, mode: WritingMode): Promise<void> => {
      clearDebounceTimer()

      return new Promise<void>((resolve) => {
        debounceTimerRef.current = setTimeout(() => {
          analyze(text, mode).then(resolve)
        }, config.debounceMs)
      })
    },
    [analyze, clearDebounceTimer, config.debounceMs]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearDebounceTimer()
      abortRequest()
    }
  }, [clearDebounceTimer, abortRequest])

  return {
    ...state,
    analyze: config.autoAnalyze ? debouncedAnalyze : analyze,
    fetchSuggestions,
    clearError,
    clear,
  }
}
