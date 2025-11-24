import type { Tone, SuggestionCategory, SuggestionSeverity } from './index'

/**
 * OpenAI API response structure
 */
export interface OpenAIResponse {
  /** Analyzed text content */
  content: string
  /** Token usage information */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  /** Model used for completion */
  model: string
  /** Finish reason */
  finishReason?: string
}

/**
 * Analysis result from OpenAI
 */
export interface AnalysisResult {
  /** Detected tone of the text */
  tone: Tone
  /** Readability score (0-100, Flesch Reading Ease) */
  readabilityScore: number
  /** Grade level (Flesch-Kincaid) */
  gradeLevel: number
  /** Writing suggestions */
  suggestions: WritingSuggestion[]
  /** Overall sentiment (positive, neutral, negative) */
  sentiment?: 'positive' | 'neutral' | 'negative'
  /** Key themes or topics identified */
  themes?: string[]
  /** Strengths of the writing */
  strengths?: string[]
  /** Areas for improvement */
  improvements?: string[]
}

/**
 * Writing suggestion from analysis
 */
export interface WritingSuggestion {
  /** Unique identifier */
  id: string
  /** Suggestion category */
  category: SuggestionCategory
  /** Severity level */
  severity: SuggestionSeverity
  /** Description of the issue */
  message: string
  /** Original text that needs improvement */
  originalText: string
  /** Suggested replacement text */
  suggestedText?: string
  /** Alternative suggestions */
  alternatives?: string[]
  /** Position in text (character offset) */
  position: {
    start: number
    end: number
  }
  /** Detailed explanation */
  explanation?: string
}

/**
 * API Error structure
 */
export interface ApiError {
  /** Error code */
  code: string
  /** Human-readable error message */
  message: string
  /** HTTP status code */
  status?: number
  /** Additional error details */
  details?: Record<string, unknown>
  /** Whether the error is retryable */
  retryable: boolean
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  /** Requests remaining in current window */
  remaining: number
  /** Rate limit reset time (timestamp) */
  resetAt: Date
  /** Total requests allowed in window */
  limit: number
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  /** Maximum number of retries */
  maxRetries?: number
  /** Timeout in milliseconds */
  timeout?: number
  /** Abort signal for cancellation */
  signal?: AbortSignal
}

/**
 * Streaming response chunk
 */
export interface StreamChunk {
  /** Chunk content */
  content: string
  /** Whether this is the final chunk */
  isFinal: boolean
  /** Accumulated content so far */
  accumulated: string
}
