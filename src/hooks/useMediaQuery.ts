import { useState, useEffect } from 'react'

/**
 * Breakpoint values (matching CSS custom properties)
 */
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const

/**
 * Media query return type
 */
export interface MediaQueryResult {
  /** Is mobile screen (< 768px) */
  isMobile: boolean
  /** Is tablet screen (>= 768px and < 1024px) */
  isTablet: boolean
  /** Is desktop screen (>= 1024px) */
  isDesktop: boolean
  /** Is wide screen (>= 1440px) */
  isWide: boolean
  /** Current width in pixels */
  width: number
}

/**
 * Custom hook for responsive breakpoint detection
 * Uses matchMedia API for efficient media query matching
 *
 * @returns MediaQueryResult with breakpoint booleans and current width
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isMobile, isDesktop } = useMediaQuery()
 *
 *   return (
 *     <div>
 *       {isMobile ? <MobileView /> : <DesktopView />}
 *     </div>
 *   )
 * }
 * ```
 */
export function useMediaQuery(): MediaQueryResult {
  const [mediaQuery, setMediaQuery] = useState<MediaQueryResult>(() => {
    // Server-side rendering fallback
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isWide: false,
        width: 1024,
      }
    }

    // Initial state from window
    return getMediaQuery()
  })

  useEffect(() => {
    // Skip if not in browser
    if (typeof window === 'undefined') {
      return
    }

    /**
     * Update media query state
     */
    const updateMediaQuery = () => {
      setMediaQuery(getMediaQuery())
    }

    // Create media query lists
    const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.tablet - 1}px)`)
    const tabletQuery = window.matchMedia(
      `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`
    )
    const desktopQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`)
    const wideQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.wide}px)`)

    // Add listeners
    mobileQuery.addEventListener('change', updateMediaQuery)
    tabletQuery.addEventListener('change', updateMediaQuery)
    desktopQuery.addEventListener('change', updateMediaQuery)
    wideQuery.addEventListener('change', updateMediaQuery)

    // Also listen to resize for width updates
    window.addEventListener('resize', updateMediaQuery)

    // Initial update
    updateMediaQuery()

    // Cleanup
    return () => {
      mobileQuery.removeEventListener('change', updateMediaQuery)
      tabletQuery.removeEventListener('change', updateMediaQuery)
      desktopQuery.removeEventListener('change', updateMediaQuery)
      wideQuery.removeEventListener('change', updateMediaQuery)
      window.removeEventListener('resize', updateMediaQuery)
    }
  }, [])

  return mediaQuery
}

/**
 * Get current media query state
 */
function getMediaQuery(): MediaQueryResult {
  const width = window.innerWidth

  return {
    isMobile: width < BREAKPOINTS.tablet,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop,
    isWide: width >= BREAKPOINTS.wide,
    width,
  }
}

/**
 * Hook for a specific media query string
 *
 * @param query - Media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the query matches
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isLandscape = useMediaQueryMatch('(orientation: landscape)')
 *   return <div>{isLandscape ? 'Landscape' : 'Portrait'}</div>
 * }
 * ```
 */
export function useMediaQueryMatch(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(query)

    const updateMatches = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // Set initial value
    setMatches(mediaQuery.matches)

    // Add listener
    mediaQuery.addEventListener('change', updateMatches)

    return () => {
      mediaQuery.removeEventListener('change', updateMatches)
    }
  }, [query])

  return matches
}
