import { createContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'
import type { WritingMode } from '../types'
import type { AnalysisResult } from '../types/api'
import { saveText, loadText, saveMode, loadMode, getLastSaved } from '../services/storage.service'

/**
 * Writing context state interface
 */
export interface WritingContextState {
  /** Current writing mode */
  currentMode: WritingMode
  /** Current text content */
  text: string
  /** Current analysis results */
  analysisResult: AnalysisResult | null
  /** Whether analysis is in progress */
  isAnalyzing: boolean
  /** Whether currently saving */
  isSaving: boolean
  /** Last saved timestamp */
  lastSaved: Date | null
}

/**
 * Writing context actions interface
 */
export interface WritingContextActions {
  /** Set the current writing mode */
  setMode: (mode: WritingMode) => void
  /** Set the text content */
  setText: (text: string) => void
  /** Set the analysis result */
  setAnalysisResult: (result: AnalysisResult | null) => void
  /** Set analyzing state */
  setIsAnalyzing: (isAnalyzing: boolean) => void
  /** Clear all analysis data */
  clearAnalysis: () => void
}

/**
 * Combined context type
 */
export interface WritingContextType extends WritingContextState, WritingContextActions {}

/**
 * Default context value
 */
const defaultContextValue: WritingContextType = {
  currentMode: 'casual',
  text: '',
  analysisResult: null,
  isAnalyzing: false,
  isSaving: false,
  lastSaved: null,
  setMode: () => {
    throw new Error('WritingContext not initialized')
  },
  setText: () => {
    throw new Error('WritingContext not initialized')
  },
  setAnalysisResult: () => {
    throw new Error('WritingContext not initialized')
  },
  setIsAnalyzing: () => {
    throw new Error('WritingContext not initialized')
  },
  clearAnalysis: () => {
    throw new Error('WritingContext not initialized')
  },
}

/**
 * Writing Context
 */
export const WritingContext = createContext<WritingContextType>(defaultContextValue)

/**
 * Provider props
 */
export interface WritingProviderProps {
  children: ReactNode
  /** Initial writing mode */
  initialMode?: WritingMode
  /** Initial text content */
  initialText?: string
}

/**
 * Writing Context Provider
 * Provides global state for writing mode, text, and analysis with persistence
 */
export function WritingProvider({
  children,
  initialMode = 'casual',
  initialText = '',
}: WritingProviderProps) {
  // Load initial state from localStorage
  const [currentMode, setCurrentMode] = useState<WritingMode>(() => {
    const savedMode = loadMode()
    return savedMode || initialMode
  })

  const [text, setTextState] = useState<string>(() => {
    const savedText = loadText()
    return savedText || initialText
  })

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(() => {
    return getLastSaved()
  })

  // Debounce timer for auto-save
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const AUTO_SAVE_DELAY = 2000 // 2 seconds

  /**
   * Set text with auto-save
   */
  const setText = useCallback((newText: string) => {
    setTextState(newText)

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    // Set saving state
    setIsSaving(true)

    // Debounce save
    saveTimerRef.current = setTimeout(() => {
      const success = saveText(newText)
      if (success) {
        setLastSaved(new Date())
      }
      setIsSaving(false)
    }, AUTO_SAVE_DELAY)
  }, [])

  /**
   * Set writing mode with persistence
   */
  const setMode = useCallback((mode: WritingMode) => {
    setCurrentMode(mode)
    saveMode(mode)
  }, [])

  /**
   * Clear analysis data
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [])

  const value: WritingContextType = {
    // State
    currentMode,
    text,
    analysisResult,
    isAnalyzing,
    isSaving,
    lastSaved,
    // Actions
    setMode,
    setText,
    setAnalysisResult,
    setIsAnalyzing,
    clearAnalysis,
  }

  return <WritingContext.Provider value={value}>{children}</WritingContext.Provider>
}
