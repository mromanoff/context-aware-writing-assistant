import { describe, it, expect } from 'vitest'
import { calculateReadability, analyzeTone, detectComplexity, type Tone } from '../textAnalysis'

describe('calculateReadability', () => {
  it('returns 0 for empty string', () => {
    expect(calculateReadability('')).toBe(0)
  })

  it('returns 0 for whitespace-only string', () => {
    expect(calculateReadability('   ')).toBe(0)
  })

  it('calculates score for simple text', () => {
    const simpleText = 'The cat sat on the mat.'
    const score = calculateReadability(simpleText)
    expect(score).toBeGreaterThan(80) // Should be easy to read
    expect(score).toBeLessThanOrEqual(100)
  })

  it('calculates score for complex text', () => {
    const complexText =
      'The implementation of sophisticated algorithms necessitates comprehensive understanding of computational complexity.'
    const score = calculateReadability(complexText)
    expect(score).toBeLessThan(60) // Should be harder to read
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('handles single word', () => {
    const score = calculateReadability('Hello')
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('handles multiple sentences', () => {
    const text = 'This is sentence one. This is sentence two! Is this sentence three?'
    const score = calculateReadability(text)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('returns consistent scores for identical text', () => {
    const text = 'The quick brown fox jumps over the lazy dog.'
    const score1 = calculateReadability(text)
    const score2 = calculateReadability(text)
    expect(score1).toBe(score2)
  })

  it('handles text with numbers and punctuation', () => {
    const text = 'There are 3 cats, 2 dogs, and 1 bird!'
    const score = calculateReadability(text)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})

describe('analyzeTone', () => {
  it('detects formal tone', () => {
    const formalText = 'Therefore, we must consider the consequences. Furthermore, this shall be addressed.'
    expect(analyzeTone(formalText)).toBe('formal')
  })

  it('detects casual tone', () => {
    const casualText = 'Yeah, that sounds awesome! Gonna check it out later, btw.'
    expect(analyzeTone(casualText)).toBe('casual')
  })

  it('detects technical tone', () => {
    const technicalText =
      'The algorithm implements a recursive function to optimize the data structure.'
    expect(analyzeTone(technicalText)).toBe('technical')
  })

  it('detects creative tone', () => {
    const creativeText = 'Imagine a world where dreams come alive... A magical, enchanting experience.'
    expect(analyzeTone(creativeText)).toBe('creative')
  })

  it('returns neutral for plain text', () => {
    const neutralText = 'The weather is nice today. We went to the park.'
    expect(analyzeTone(neutralText)).toBe('neutral')
  })

  it('returns neutral for empty string', () => {
    expect(analyzeTone('')).toBe('neutral')
  })

  it('handles mixed tone indicators', () => {
    const mixedText = 'Therefore, the algorithm is cool and awesome!'
    const tone = analyzeTone(mixedText)
    // Should detect one of the tones
    expect(['formal', 'casual', 'technical', 'creative', 'neutral']).toContain(tone)
  })

  it('is case-insensitive', () => {
    const upperText = 'YEAH THAT IS AWESOME'
    const lowerText = 'yeah that is awesome'
    expect(analyzeTone(upperText)).toBe(analyzeTone(lowerText))
  })
})

describe('detectComplexity', () => {
  it('returns zero values for empty string', () => {
    const result = detectComplexity('')
    expect(result.avgSentenceLength).toBe(0)
    expect(result.complexWordPercentage).toBe(0)
    expect(result.avgWordLength).toBe(0)
    expect(result.longestSentence).toBe(0)
  })

  it('calculates average sentence length', () => {
    const text = 'Short sentence. This is a longer sentence with more words.'
    const result = detectComplexity(text)
    expect(result.avgSentenceLength).toBeGreaterThan(0)
  })

  it('detects complex words', () => {
    const simpleText = 'The cat sat on the mat.'
    const complexText = 'The implementation of sophisticated algorithms.'

    const simpleResult = detectComplexity(simpleText)
    const complexResult = detectComplexity(complexText)

    expect(complexResult.complexWordPercentage).toBeGreaterThan(
      simpleResult.complexWordPercentage
    )
  })

  it('calculates average word length', () => {
    const shortWords = 'I am a cat.'
    const longWords = 'Understanding sophisticated terminology.'

    const shortResult = detectComplexity(shortWords)
    const longResult = detectComplexity(longWords)

    expect(longResult.avgWordLength).toBeGreaterThan(shortResult.avgWordLength)
  })

  it('finds longest sentence', () => {
    const text = 'Short. This is a much longer sentence with many words in it.'
    const result = detectComplexity(text)
    expect(result.longestSentence).toBeGreaterThan(5)
  })

  it('handles single word', () => {
    const result = detectComplexity('Hello')
    expect(result.avgSentenceLength).toBe(1)
    expect(result.longestSentence).toBe(1)
  })

  it('handles text with punctuation', () => {
    const text = 'Hello, world! How are you today?'
    const result = detectComplexity(text)
    expect(result.avgSentenceLength).toBeGreaterThan(0)
    expect(result.avgWordLength).toBeGreaterThan(0)
  })

  it('returns consistent results for same text', () => {
    const text = 'The quick brown fox jumps over the lazy dog.'
    const result1 = detectComplexity(text)
    const result2 = detectComplexity(text)

    expect(result1.avgSentenceLength).toBe(result2.avgSentenceLength)
    expect(result1.complexWordPercentage).toBe(result2.complexWordPercentage)
    expect(result1.avgWordLength).toBe(result2.avgWordLength)
    expect(result1.longestSentence).toBe(result2.longestSentence)
  })
})
