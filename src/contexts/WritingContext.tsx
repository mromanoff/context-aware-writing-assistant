import { createContext, useState, useCallback, ReactNode } from 'react'
import type { WritingMode } from '../types'
import type { AnalysisResult } from '../types/api'

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
 * Provides global state for writing mode, text, and analysis
 */
export function WritingProvider({
  children,
  initialMode = 'casual',
  initialText = '',
}: WritingProviderProps) {
  const [currentMode, setCurrentMode] = useState<WritingMode>(initialMode)
  const [text, setText] = useState<string>(initialText)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)

  /**
   * Set writing mode
   */
  const setMode = useCallback((mode: WritingMode) => {
    setCurrentMode(mode)
  }, [])

  /**
   * Clear analysis data
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }, [])

  const value: WritingContextType = {
    // State
    currentMode,
    text,
    analysisResult,
    isAnalyzing,
    // Actions
    setMode,
    setText,
    setAnalysisResult,
    setIsAnalyzing,
    clearAnalysis,
  }

  return <WritingContext.Provider value={value}>{children}</WritingContext.Provider>
}
