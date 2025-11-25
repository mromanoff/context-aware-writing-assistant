/**
 * Text Analysis Utilities
 * Provides real-time analysis of text including readability, tone, and complexity
 */

/**
 * Tone types
 */
export type Tone = 'formal' | 'casual' | 'technical' | 'creative' | 'neutral'

/**
 * Complexity analysis result
 */
export interface ComplexityAnalysis {
  /** Average sentence length in words */
  avgSentenceLength: number
  /** Percentage of complex words (3+ syllables) */
  complexWordPercentage: number
  /** Average word length in characters */
  avgWordLength: number
  /** Longest sentence length in words */
  longestSentence: number
}

/**
 * Calculate the Flesch Reading Ease score
 * Formula: 206.835 - 1.015 × (total words / total sentences) - 84.6 × (total syllables / total words)
 *
 * Score interpretation:
 * 90-100: Very Easy (5th grade)
 * 80-89: Easy (6th grade)
 * 70-79: Fairly Easy (7th grade)
 * 60-69: Standard (8th-9th grade)
 * 50-59: Fairly Difficult (10th-12th grade)
 * 30-49: Difficult (College)
 * 0-29: Very Difficult (College graduate)
 *
 * @param text - The text to analyze
 * @returns Readability score from 0-100 (higher = easier to read)
 */
export function calculateReadability(text: string): number {
  const trimmedText = text.trim()

  if (!trimmedText) {
    return 0
  }

  // Count sentences (split by . ! ?)
  const sentences = trimmedText
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 0)
  const sentenceCount = Math.max(sentences.length, 1)

  // Count words
  const words = trimmedText
    .split(/\s+/)
    .filter((word) => word.length > 0)
  const wordCount = Math.max(words.length, 1)

  // Count syllables
  const syllableCount = words.reduce((total, word) => {
    return total + countSyllables(word)
  }, 0)

  // Calculate Flesch Reading Ease
  const avgWordsPerSentence = wordCount / sentenceCount
  const avgSyllablesPerWord = syllableCount / wordCount

  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord

  // Clamp score between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Count syllables in a word (simplified algorithm)
 * This is a basic implementation that works reasonably well for English
 *
 * @param word - The word to analyze
 * @returns Number of syllables
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '')

  if (word.length <= 3) {
    return 1
  }

  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g)
  let syllables = vowelGroups ? vowelGroups.length : 1

  // Adjust for silent 'e'
  if (word.endsWith('e')) {
    syllables--
  }

  // Adjust for 'le' ending
  if (word.endsWith('le') && word.length > 2 && !/[aeiouy]/.test(word[word.length - 3])) {
    syllables++
  }

  // Ensure at least 1 syllable
  return Math.max(syllables, 1)
}

/**
 * Analyze the tone of the text
 * Uses keyword matching and patterns to determine tone
 *
 * @param text - The text to analyze
 * @returns Detected tone
 */
export function analyzeTone(text: string): Tone {
  const lowerText = text.toLowerCase()

  // Formal indicators
  const formalPatterns = [
    /\b(therefore|furthermore|moreover|consequently|thus|hence)\b/,
    /\b(regarding|pursuant|herewith|hereby)\b/,
    /\b(shall|ought|must)\b/,
  ]

  // Casual indicators
  const casualPatterns = [
    /\b(yeah|yep|nope|gonna|wanna|kinda|sorta)\b/,
    /\b(cool|awesome|great|nice)\b/,
    /[!]{2,}/, // Multiple exclamation marks
    /\b(lol|btw|tbh|imo)\b/,
  ]

  // Technical indicators
  const technicalPatterns = [
    /\b(algorithm|function|parameter|variable|implementation|optimize)\b/,
    /\b(methodology|analysis|framework|architecture|infrastructure)\b/,
    /\b(interface|component|module|protocol)\b/,
  ]

  // Creative indicators
  const creativePatterns = [
    /\b(imagine|envision|dream|wonder|magical|enchanting)\b/,
    /\b(vibrant|brilliant|dazzling|mesmerizing)\b/,
    /[.]{3}/, // Ellipsis
  ]

  // Count matches for each tone
  const formalScore = formalPatterns.reduce(
    (score, pattern) => score + (pattern.test(lowerText) ? 1 : 0),
    0
  )

  const casualScore = casualPatterns.reduce(
    (score, pattern) => score + (pattern.test(lowerText) ? 1 : 0),
    0
  )

  const technicalScore = technicalPatterns.reduce(
    (score, pattern) => score + (pattern.test(lowerText) ? 1 : 0),
    0
  )

  const creativeScore = creativePatterns.reduce(
    (score, pattern) => score + (pattern.test(lowerText) ? 1 : 0),
    0
  )

  // Determine tone based on highest score
  const scores = {
    formal: formalScore,
    casual: casualScore,
    technical: technicalScore,
    creative: creativeScore,
  }

  const maxScore = Math.max(...Object.values(scores))

  // If no clear tone detected, return neutral
  if (maxScore === 0) {
    return 'neutral'
  }

  // Return tone with highest score
  const detectedTone = (Object.keys(scores) as Tone[]).find(
    (tone) => scores[tone as keyof typeof scores] === maxScore
  )

  return detectedTone || 'neutral'
}

/**
 * Detect text complexity metrics
 *
 * @param text - The text to analyze
 * @returns Complexity analysis
 */
export function detectComplexity(text: string): ComplexityAnalysis {
  const trimmedText = text.trim()

  if (!trimmedText) {
    return {
      avgSentenceLength: 0,
      complexWordPercentage: 0,
      avgWordLength: 0,
      longestSentence: 0,
    }
  }

  // Split into sentences
  const sentences = trimmedText
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 0)

  // Get all words
  const words = trimmedText
    .split(/\s+/)
    .filter((word) => word.length > 0)

  const wordCount = Math.max(words.length, 1)
  const sentenceCount = Math.max(sentences.length, 1)

  // Calculate average sentence length
  const avgSentenceLength = Math.round(wordCount / sentenceCount)

  // Find longest sentence
  const longestSentence = sentences.reduce((max, sentence) => {
    const sentenceWords = sentence.trim().split(/\s+/).length
    return Math.max(max, sentenceWords)
  }, 0)

  // Calculate complex words (3+ syllables)
  const complexWords = words.filter((word) => countSyllables(word) >= 3)
  const complexWordPercentage = Math.round((complexWords.length / wordCount) * 100)

  // Calculate average word length
  const totalCharacters = words.reduce((total, word) => {
    return total + word.replace(/[^a-zA-Z]/g, '').length
  }, 0)
  const avgWordLength = Math.round(totalCharacters / wordCount)

  return {
    avgSentenceLength,
    complexWordPercentage,
    avgWordLength,
    longestSentence,
  }
}
