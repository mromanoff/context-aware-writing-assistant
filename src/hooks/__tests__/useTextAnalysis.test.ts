import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTextAnalysis } from '../useTextAnalysis'

describe('useTextAnalysis', () => {
  describe('Empty text', () => {
    it('returns zero values for empty string', () => {
      const { result } = renderHook(() => useTextAnalysis(''))

      expect(result.current.wordCount).toBe(0)
      expect(result.current.characterCount).toBe(0)
      expect(result.current.characterCountNoSpaces).toBe(0)
      expect(result.current.sentenceCount).toBe(0)
      expect(result.current.paragraphCount).toBe(0)
      expect(result.current.avgWordsPerSentence).toBe(0)
      expect(result.current.readingTime).toBe(0)
    })

    it('returns zero values for whitespace-only string', () => {
      const { result } = renderHook(() => useTextAnalysis('   \n  \t  '))

      expect(result.current.wordCount).toBe(0)
      expect(result.current.characterCount).toBe(0)
    })
  })

  describe('Word counting', () => {
    it('counts single word', () => {
      const { result } = renderHook(() => useTextAnalysis('Hello'))

      expect(result.current.wordCount).toBe(1)
    })

    it('counts multiple words', () => {
      const { result } = renderHook(() => useTextAnalysis('The quick brown fox'))

      expect(result.current.wordCount).toBe(4)
    })

    it('handles multiple spaces between words', () => {
      const { result } = renderHook(() => useTextAnalysis('Hello    world'))

      expect(result.current.wordCount).toBe(2)
    })

    it('handles newlines and tabs', () => {
      const { result } = renderHook(() => useTextAnalysis('Hello\nworld\ttest'))

      expect(result.current.wordCount).toBe(3)
    })
  })

  describe('Character counting', () => {
    it('counts characters with spaces', () => {
      const { result } = renderHook(() => useTextAnalysis('Hello world'))

      expect(result.current.characterCount).toBe(11)
    })

    it('counts characters without spaces', () => {
      const { result } = renderHook(() => useTextAnalysis('Hello world'))

      expect(result.current.characterCountNoSpaces).toBe(10)
    })

    it('includes punctuation in character count', () => {
      const { result } = renderHook(() => useTextAnalysis('Hello, world!'))

      expect(result.current.characterCount).toBe(13)
    })
  })

  describe('Sentence counting', () => {
    it('counts single sentence', () => {
      const { result } = renderHook(() => useTextAnalysis('This is a sentence.'))

      expect(result.current.sentenceCount).toBe(1)
    })

    it('counts multiple sentences with periods', () => {
      const { result } = renderHook(() =>
        useTextAnalysis('First sentence. Second sentence. Third sentence.')
      )

      expect(result.current.sentenceCount).toBe(3)
    })

    it('counts sentences with exclamation marks', () => {
      const { result } = renderHook(() => useTextAnalysis('Hello! How are you?'))

      expect(result.current.sentenceCount).toBe(2)
    })

    it('counts sentences with question marks', () => {
      const { result } = renderHook(() => useTextAnalysis('What is this? Is it good?'))

      expect(result.current.sentenceCount).toBe(2)
    })

    it('handles mixed punctuation', () => {
      const { result } = renderHook(() =>
        useTextAnalysis('Statement. Question? Exclamation!')
      )

      expect(result.current.sentenceCount).toBe(3)
    })
  })

  describe('Paragraph counting', () => {
    it('counts single paragraph', () => {
      const { result } = renderHook(() => useTextAnalysis('This is a paragraph.'))

      expect(result.current.paragraphCount).toBe(1)
    })

    it('counts multiple paragraphs separated by double newline', () => {
      const { result } = renderHook(() =>
        useTextAnalysis('First paragraph.\n\nSecond paragraph.')
      )

      expect(result.current.paragraphCount).toBe(2)
    })

    it('ignores single newlines within paragraph', () => {
      const { result } = renderHook(() =>
        useTextAnalysis('First line.\nSecond line in same paragraph.')
      )

      expect(result.current.paragraphCount).toBe(1)
    })
  })

  describe('Average words per sentence', () => {
    it('calculates average correctly', () => {
      const { result } = renderHook(() =>
        useTextAnalysis('Short sentence. This is a longer sentence with more words.')
      )

      // 2 sentences, 10 total words = 5 words per sentence
      expect(result.current.avgWordsPerSentence).toBe(5)
    })

    it('returns 0 for no sentences', () => {
      const { result } = renderHook(() => useTextAnalysis(''))

      expect(result.current.avgWordsPerSentence).toBe(0)
    })

    it('rounds to one decimal place', () => {
      const { result } = renderHook(() =>
        useTextAnalysis('One two three. Four five.')
      )

      // 2 sentences, 5 words = 2.5 words per sentence
      expect(result.current.avgWordsPerSentence).toBe(2.5)
    })
  })

  describe('Reading time', () => {
    it('calculates reading time for short text', () => {
      const words = new Array(50).fill('word').join(' ')
      const { result } = renderHook(() => useTextAnalysis(words))

      // 50 words at 200 wpm = 0.25 minutes, rounds up to 1
      expect(result.current.readingTime).toBe(1)
    })

    it('calculates reading time for longer text', () => {
      const words = new Array(400).fill('word').join(' ')
      const { result } = renderHook(() => useTextAnalysis(words))

      // 400 words at 200 wpm = 2 minutes
      expect(result.current.readingTime).toBe(2)
    })

    it('rounds up reading time', () => {
      const words = new Array(250).fill('word').join(' ')
      const { result } = renderHook(() => useTextAnalysis(words))

      // 250 words at 200 wpm = 1.25 minutes, rounds up to 2
      expect(result.current.readingTime).toBe(2)
    })

    it('returns 0 for empty text', () => {
      const { result } = renderHook(() => useTextAnalysis(''))

      expect(result.current.readingTime).toBe(0)
    })
  })

  describe('Memoization', () => {
    it('returns same object reference for same input', () => {
      const text = 'Test text for memoization'
      const { result, rerender } = renderHook(({ text }) => useTextAnalysis(text), {
        initialProps: { text },
      })

      const firstResult = result.current

      // Rerender with same text
      rerender({ text })

      // Should be the exact same object (referential equality)
      expect(result.current).toBe(firstResult)
    })

    it('returns new object when input changes', () => {
      const { result, rerender } = renderHook(({ text }) => useTextAnalysis(text), {
        initialProps: { text: 'First text' },
      })

      const firstResult = result.current

      // Rerender with different text
      rerender({ text: 'Different text' })

      // Should be a different object
      expect(result.current).not.toBe(firstResult)
    })
  })
})
