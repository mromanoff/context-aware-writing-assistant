import { useContext } from 'react'
import { WritingContext } from '../contexts/WritingContext'
import type { WritingContextType } from '../contexts/WritingContext'

/**
 * Custom hook to consume WritingContext
 * Provides access to writing mode state and actions
 *
 * @throws Error if used outside of WritingProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentMode, setMode } = useWritingMode()
 *
 *   return (
 *     <button onClick={() => setMode('technical')}>
 *       Switch to Technical
 *     </button>
 *   )
 * }
 * ```
 */
export function useWritingMode(): WritingContextType {
  const context = useContext(WritingContext)

  if (!context) {
    throw new Error(
      'useWritingMode must be used within a WritingProvider. ' +
        'Wrap your component tree with <WritingProvider>.'
    )
  }

  return context
}
