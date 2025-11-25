import { useState, useEffect, useCallback } from 'react'
import { logError } from '../utils/errorHandling'

/**
 * Custom hook for managing localStorage with TypeScript support
 * Automatically syncs state with localStorage and handles JSON serialization
 *
 * @template T - The type of value to store
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns Tuple of [storedValue, setValue, removeValue]
 *
 * @example
 * const [name, setName] = useLocalStorage<string>('user-name', 'Anonymous')
 * const [settings, setSettings] = useLocalStorage<Settings>('settings', defaultSettings)
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)

      // Parse stored json or if none return initialValue
      if (item) {
        return JSON.parse(item) as T
      }

      return initialValue
    } catch (error) {
      // If error also return initialValue
      logError(error, `useLocalStorage.init(${key})`)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))

          // Dispatch custom event for cross-tab synchronization
          window.dispatchEvent(
            new CustomEvent('local-storage-change', {
              detail: { key, value: valueToStore },
            })
          )
        }
      } catch (error) {
        // Handle quota exceeded error
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.error(`[useLocalStorage] Storage quota exceeded for key: ${key}`)
          // Optionally clear old data or notify user
        } else {
          logError(error, `useLocalStorage.setValue(${key})`)
        }
      }
    },
    [key, storedValue]
  )

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
        setStoredValue(initialValue)

        // Dispatch custom event for cross-tab synchronization
        window.dispatchEvent(
          new CustomEvent('local-storage-change', {
            detail: { key, value: null },
          })
        )
      }
    } catch (error) {
      logError(error, `useLocalStorage.removeValue(${key})`)
    }
  }, [key, initialValue])

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      // Handle native storage event (cross-tab)
      if (e instanceof StorageEvent) {
        if (e.key === key && e.newValue !== null) {
          try {
            const newValue = JSON.parse(e.newValue) as T
            setStoredValue(newValue)
          } catch (error) {
            logError(error, `useLocalStorage.storageEvent(${key})`)
          }
        }
      }
      // Handle custom event (same tab)
      else if (e instanceof CustomEvent) {
        const detail = e.detail as { key: string; value: T | null }
        if (detail.key === key) {
          if (detail.value !== null) {
            setStoredValue(detail.value)
          } else {
            setStoredValue(initialValue)
          }
        }
      }
    }

    // Listen to both storage events (cross-tab) and custom events (same tab)
    window.addEventListener('storage', handleStorageChange as EventListener)
    window.addEventListener('local-storage-change', handleStorageChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener)
      window.removeEventListener('local-storage-change', handleStorageChange as EventListener)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
