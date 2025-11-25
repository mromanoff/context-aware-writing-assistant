import { useState, useEffect } from 'react'

/**
 * Custom hook for debouncing a value
 * Returns a debounced version of the value that only updates after the specified delay
 *
 * @template T - The type of the value to debounce
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 500)
 *
 * useEffect(() => {
 *   // This will only run 500ms after the user stops typing
 *   performSearch(debouncedSearchTerm)
 * }, [debouncedSearchTerm])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timer if value changes before delay is reached
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
