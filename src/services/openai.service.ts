import OpenAI from 'openai'
import type { WritingMode } from '../types'
import type {
  AnalysisResult,
  ApiError,
  ApiRequestOptions,
  WritingSuggestion,
} from '../types/api'
import {
  SYSTEM_PROMPTS,
  getAnalysisPrompt,
  getSuggestionsPrompt,
  RATE_LIMIT_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  API_ERROR_MESSAGE,
  MISSING_API_KEY_MESSAGE,
} from '../utils/prompts'

/**
 * OpenAI Service Configuration
 */
const CONFIG = {
  model: 'gpt-4-turbo-preview',
  maxTokens: 2000,
  temperature: 0.7,
  maxRetries: 3,
  retryDelay: 1000, // Initial delay in ms
  timeout: 30000, // 30 seconds
}

/**
 * Get OpenAI client instance
 */
function getOpenAIClient(): OpenAI {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(MISSING_API_KEY_MESSAGE)
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // For client-side usage (consider moving to backend)
  })
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Calculate exponential backoff delay
 */
function getBackoffDelay(attempt: number, baseDelay: number): number {
  return baseDelay * Math.pow(2, attempt)
}

/**
 * Create API error from OpenAI error
 */
function createApiError(error: unknown): ApiError {
  if (error instanceof OpenAI.APIError) {
    const isRateLimit = error.status === 429
    const isServerError = error.status && error.status >= 500

    return {
      code: error.code || 'API_ERROR',
      message: isRateLimit
        ? RATE_LIMIT_ERROR_MESSAGE
        : error.message || API_ERROR_MESSAGE,
      status: error.status,
      details: { type: error.type },
      retryable: isRateLimit || isServerError,
    }
  }

  if (error instanceof Error) {
    const isNetworkError = error.message.includes('fetch') || error.message.includes('network')

    return {
      code: 'NETWORK_ERROR',
      message: isNetworkError ? NETWORK_ERROR_MESSAGE : error.message,
      retryable: isNetworkError,
    }
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: API_ERROR_MESSAGE,
    retryable: false,
  }
}

/**
 * Make API request with retry logic
 */
async function makeRequestWithRetry<T>(
  requestFn: () => Promise<T>,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { maxRetries = CONFIG.maxRetries, timeout = CONFIG.timeout } = options
  let lastError: ApiError | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add timeout to request
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )

      const result = await Promise.race([requestFn(), timeoutPromise])
      return result
    } catch (error) {
      lastError = createApiError(error)

      // Don't retry if not retryable or last attempt
      if (!lastError.retryable || attempt === maxRetries) {
        break
      }

      // Calculate backoff delay
      const delay = getBackoffDelay(attempt, CONFIG.retryDelay)
      await sleep(delay)
    }
  }

  throw lastError
}

/**
 * Parse JSON response safely
 */
function parseJsonResponse<T>(content: string, fallback: T): T {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
    const jsonString = jsonMatch ? jsonMatch[1] : content

    return JSON.parse(jsonString) as T
  } catch {
    return fallback
  }
}

/**
 * Analyze text with OpenAI
 */
export async function analyzeText(
  text: string,
  mode: WritingMode,
  options?: ApiRequestOptions
): Promise<AnalysisResult> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty')
  }

  const client = getOpenAIClient()

  return makeRequestWithRetry(async () => {
    const completion = await client.chat.completions.create({
      model: CONFIG.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[mode] },
        { role: 'user', content: getAnalysisPrompt(text, mode) },
      ],
      max_tokens: CONFIG.maxTokens,
      temperature: CONFIG.temperature,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content || '{}'

    // Parse the response with fallback
    const result = parseJsonResponse<Partial<AnalysisResult>>(content, {})

    // Add IDs to suggestions and ensure proper structure
    const suggestions: WritingSuggestion[] =
      result.suggestions?.map((s, index) => ({
        id: `suggestion-${Date.now()}-${index}`,
        category: s.category || 'style',
        severity: s.severity || 'suggestion',
        message: s.message || '',
        originalText: s.originalText || '',
        suggestedText: s.suggestedText,
        alternatives: s.alternatives,
        position: s.position || { start: 0, end: 0 },
        explanation: s.explanation,
      })) || []

    return {
      tone: result.tone || 'neutral',
      readabilityScore: result.readabilityScore || 0,
      gradeLevel: result.gradeLevel || 0,
      sentiment: result.sentiment,
      themes: result.themes || [],
      strengths: result.strengths || [],
      improvements: result.improvements || [],
      suggestions,
    }
  }, options)
}

/**
 * Get writing suggestions
 */
export async function getSuggestions(
  text: string,
  mode: WritingMode,
  options?: ApiRequestOptions
): Promise<WritingSuggestion[]> {
  if (!text || text.trim().length === 0) {
    return []
  }

  const client = getOpenAIClient()

  return makeRequestWithRetry(async () => {
    const completion = await client.chat.completions.create({
      model: CONFIG.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[mode] },
        { role: 'user', content: getSuggestionsPrompt(text, mode) },
      ],
      max_tokens: CONFIG.maxTokens,
      temperature: CONFIG.temperature,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content || '[]'
    const suggestions = parseJsonResponse<Partial<WritingSuggestion>[]>(content, [])

    return suggestions.map((s, index) => ({
      id: `suggestion-${Date.now()}-${index}`,
      category: s.category || 'style',
      severity: s.severity || 'suggestion',
      message: s.message || '',
      originalText: s.originalText || '',
      suggestedText: s.suggestedText,
      alternatives: s.alternatives,
      position: s.position || { start: 0, end: 0 },
      explanation: s.explanation,
    }))
  }, options)
}

/**
 * Check if API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return !!import.meta.env.VITE_OPENAI_API_KEY
}
