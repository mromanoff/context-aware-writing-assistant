import { useEffect, useCallback, useRef } from 'react'

/**
 * Keyboard shortcut handler function
 */
export type ShortcutHandler = (event: KeyboardEvent) => void

/**
 * Keyboard shortcut configuration
 */
export interface KeyboardShortcut {
  /** Key combination (e.g., 'ctrl+s', 'cmd+k', 'esc') */
  key: string
  /** Handler function */
  handler: ShortcutHandler
  /** Description for accessibility/help */
  description?: string
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean
  /** Whether the shortcut is enabled */
  enabled?: boolean
}

/**
 * Parse key combination string into modifier keys and key
 */
function parseKeyCombination(combination: string): {
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
  key: string
} {
  const parts = combination.toLowerCase().split('+')
  const key = parts[parts.length - 1]

  return {
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
    meta: parts.includes('cmd') || parts.includes('meta') || parts.includes('command'),
    key,
  }
}

/**
 * Check if keyboard event matches the key combination
 */
function matchesKeyCombination(event: KeyboardEvent, combination: string): boolean {
  const parsed = parseKeyCombination(combination)
  const eventKey = event.key.toLowerCase()

  // Check modifiers
  if (parsed.ctrl !== event.ctrlKey) return false
  if (parsed.alt !== event.altKey) return false
  if (parsed.shift !== event.shiftKey) return false
  if (parsed.meta !== event.metaKey) return false

  // Check key
  // Handle special keys
  if (parsed.key === 'esc' || parsed.key === 'escape') {
    return eventKey === 'escape'
  }
  if (parsed.key === 'enter' || parsed.key === 'return') {
    return eventKey === 'enter'
  }
  if (parsed.key === 'space') {
    return eventKey === ' '
  }
  if (parsed.key === '/') {
    return eventKey === '/'
  }

  return eventKey === parsed.key
}

/**
 * Custom hook for managing keyboard shortcuts
 * Supports common key combinations with proper modifier key handling
 *
 * @param shortcuts - Array of keyboard shortcut configurations
 * @param options - Additional options
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useKeyboardShortcuts([
 *     {
 *       key: 'ctrl+s',
 *       handler: () => saveDocument(),
 *       description: 'Save document',
 *       preventDefault: true,
 *     },
 *     {
 *       key: 'esc',
 *       handler: () => closeModal(),
 *       description: 'Close modal',
 *     },
 *   ])
 * }
 * ```
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: {
    /** Whether shortcuts are globally enabled */
    enabled?: boolean
    /** Target element (defaults to window) */
    target?: HTMLElement | Document | Window | null
  } = {}
): void {
  const { enabled = true, target = window } = options
  const shortcutsRef = useRef<KeyboardShortcut[]>(shortcuts)

  // Update shortcuts ref when they change
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger shortcuts when typing in input fields
      const targetElement = event.target as HTMLElement
      const isTyping =
        targetElement.tagName === 'INPUT' ||
        targetElement.tagName === 'TEXTAREA' ||
        targetElement.isContentEditable

      for (const shortcut of shortcutsRef.current) {
        // Skip disabled shortcuts
        if (shortcut.enabled === false) continue

        // Check if key combination matches
        if (matchesKeyCombination(event, shortcut.key)) {
          // For most shortcuts, don't trigger while typing
          // Exception: 'esc' should always work
          const isEscape = shortcut.key.toLowerCase().includes('esc')
          if (isTyping && !isEscape) continue

          // Prevent default if specified
          if (shortcut.preventDefault !== false) {
            event.preventDefault()
          }

          // Call handler
          shortcut.handler(event)
          break
        }
      }
    },
    [enabled]
  )

  useEffect(() => {
    if (!enabled || !target) return

    const currentTarget = target as EventTarget

    currentTarget.addEventListener('keydown', handleKeyDown as EventListener)

    return () => {
      currentTarget.removeEventListener('keydown', handleKeyDown as EventListener)
    }
  }, [enabled, target, handleKeyDown])
}

/**
 * Hook for a single keyboard shortcut
 *
 * @param key - Key combination
 * @param handler - Handler function
 * @param options - Additional options
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useKeyboardShortcut('ctrl+s', () => saveDocument(), {
 *     preventDefault: true,
 *     enabled: true,
 *   })
 * }
 * ```
 */
export function useKeyboardShortcut(
  key: string,
  handler: ShortcutHandler,
  options: {
    preventDefault?: boolean
    enabled?: boolean
    description?: string
  } = {}
): void {
  const { preventDefault = true, enabled = true, description } = options

  useKeyboardShortcuts([
    {
      key,
      handler,
      preventDefault,
      enabled,
      description,
    },
  ])
}
