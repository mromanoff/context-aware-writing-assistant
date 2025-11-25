/**
 * Storage Service
 * Provides a centralized interface for managing application data in localStorage
 */

import type { WritingMode } from '../types'
import { logError } from '../utils/errorHandling'

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  TEXT: 'writing-assistant-text',
  MODE: 'writing-assistant-mode',
  LAST_SAVED: 'writing-assistant-last-saved',
  PREFERENCES: 'writing-assistant-preferences',
} as const

/**
 * User preferences interface
 */
export interface UserPreferences {
  autoSave: boolean
  autoSaveDelay: number // milliseconds
  theme?: 'light' | 'dark' | 'auto'
}

/**
 * Default preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  autoSave: true,
  autoSaveDelay: 2000, // 2 seconds
  theme: 'auto',
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Get item from localStorage with error handling
 */
function getItem(key: string): string | null {
  if (!isLocalStorageAvailable()) {
    return null
  }

  try {
    return localStorage.getItem(key)
  } catch (error) {
    logError(error, `storage.getItem(${key})`)
    return null
  }
}

/**
 * Set item in localStorage with error handling
 */
function setItem(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    // Handle quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('[Storage] localStorage quota exceeded')
      // Optionally clear old data
      clearOldData()
    }
    logError(error, `storage.setItem(${key})`)
    return false
  }
}

/**
 * Remove item from localStorage
 */
function removeItem(key: string): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    localStorage.removeItem(key)
  } catch (error) {
    logError(error, `storage.removeItem(${key})`)
  }
}

/**
 * Clear old data to free up space
 * This is a simple implementation that clears all app data
 */
function clearOldData(): void {
  console.log('[Storage] Clearing old data to free up space')
  clearStorage()
}

/**
 * Save text to localStorage
 */
export function saveText(text: string): boolean {
  const success = setItem(STORAGE_KEYS.TEXT, text)
  if (success) {
    setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString())
  }
  return success
}

/**
 * Load text from localStorage
 */
export function loadText(): string | null {
  return getItem(STORAGE_KEYS.TEXT)
}

/**
 * Save writing mode to localStorage
 */
export function saveMode(mode: WritingMode): boolean {
  return setItem(STORAGE_KEYS.MODE, mode)
}

/**
 * Load writing mode from localStorage
 */
export function loadMode(): WritingMode | null {
  const mode = getItem(STORAGE_KEYS.MODE)
  if (mode && isValidWritingMode(mode)) {
    return mode as WritingMode
  }
  return null
}

/**
 * Type guard for WritingMode
 */
function isValidWritingMode(value: string): value is WritingMode {
  return ['technical', 'creative', 'business', 'casual'].includes(value)
}

/**
 * Get last saved timestamp
 */
export function getLastSaved(): Date | null {
  const timestamp = getItem(STORAGE_KEYS.LAST_SAVED)
  if (timestamp) {
    try {
      return new Date(timestamp)
    } catch {
      return null
    }
  }
  return null
}

/**
 * Save user preferences
 */
export function savePreferences(preferences: Partial<UserPreferences>): boolean {
  const current = loadPreferences()
  const updated = { ...current, ...preferences }
  return setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated))
}

/**
 * Load user preferences
 */
export function loadPreferences(): UserPreferences {
  const stored = getItem(STORAGE_KEYS.PREFERENCES)
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<UserPreferences>
      return { ...DEFAULT_PREFERENCES, ...parsed }
    } catch (error) {
      logError(error, 'storage.loadPreferences')
    }
  }
  return DEFAULT_PREFERENCES
}

/**
 * Clear all storage
 */
export function clearStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeItem(key)
  })
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): {
  used: number
  available: boolean
  textLength: number
} {
  const text = loadText() || ''
  const used = new Blob([text]).size
  const available = isLocalStorageAvailable()

  return {
    used,
    available,
    textLength: text.length,
  }
}

/**
 * Export all data (for backup)
 */
export function exportData(): {
  text: string | null
  mode: WritingMode | null
  lastSaved: Date | null
  preferences: UserPreferences
} {
  return {
    text: loadText(),
    mode: loadMode(),
    lastSaved: getLastSaved(),
    preferences: loadPreferences(),
  }
}

/**
 * Import data (from backup)
 */
export function importData(data: {
  text?: string
  mode?: WritingMode
  preferences?: Partial<UserPreferences>
}): boolean {
  let success = true

  if (data.text !== undefined) {
    success = saveText(data.text) && success
  }

  if (data.mode !== undefined) {
    success = saveMode(data.mode) && success
  }

  if (data.preferences !== undefined) {
    success = savePreferences(data.preferences) && success
  }

  return success
}
