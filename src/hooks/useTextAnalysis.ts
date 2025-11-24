import { useMemo } from 'react'

export interface TextStatistics {
  /** Total number of words */
  wordCount: number
  /** Total number of characters including spaces */
  characterCount: number
  /** Total number of characters excluding spaces */
  characterCountNoSpaces: number
  /** Total number of sentences */
  sentenceCount: number
  /** Total number of paragraphs */
  paragraphCount: number
  /** Average words per sentence */
  avgWordsPerSentence: number
  /** Estimated reading time in minutes (assuming 200 words per minute) */
  readingTime: number
}

/**
 * Custom hook to analyze text and return statistics
 * Uses memoization for performance optimization
 */
export function useTextAnalysis(text: string): TextStatistics {
  return useMemo(() => {
    // Handle empty text
    if (!text || text.trim().length === 0) {
      return {
        wordCount: 0,
        characterCount: 0,
        characterCountNoSpaces: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        avgWordsPerSentence: 0,
        readingTime: 0,
      }
    }

    const trimmedText = text.trim()

    // Character count
    const characterCount = text.length
    const characterCountNoSpaces = text.replace(/\s/g, '').length

    // Word count - split by whitespace and filter empty strings
    const words = trimmedText.split(/\s+/).filter((word) => word.length > 0)
    const wordCount = words.length

    // Sentence count - split by sentence-ending punctuation
    // Handle edge cases like Mr., Dr., etc.
    const sentences = trimmedText
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0)
    const sentenceCount = Math.max(sentences.length, 0)

    // Paragraph count - split by multiple newlines
    const paragraphs = trimmedText
      .split(/\n\s*\n/)
      .filter((para) => para.trim().length > 0)
    const paragraphCount = Math.max(paragraphs.length, 0)

    // Average words per sentence
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0

    // Reading time (assuming 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200)

    return {
      wordCount,
      characterCount,
      characterCountNoSpaces,
      sentenceCount,
      paragraphCount,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      readingTime,
    }
  }, [text])
}
