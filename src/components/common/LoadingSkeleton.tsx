import './LoadingSkeleton.css'

export interface LoadingSkeletonProps {
  /** Variant type */
  variant?: 'text' | 'card' | 'panel' | 'circular'
  /** Width (CSS value or preset) */
  width?: string | number
  /** Height (CSS value or preset) */
  height?: string | number
  /** Number of lines for text variant */
  lines?: number
  /** Optional className for custom styling */
  className?: string
}

/**
 * LoadingSkeleton Component
 * Displays animated skeleton placeholders for loading states
 */
export function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className = '',
}: LoadingSkeletonProps) {
  // Convert numeric values to px
  const getSize = (size: string | number | undefined): string | undefined => {
    if (typeof size === 'number') {
      return `${size}px`
    }
    return size
  }

  const style: React.CSSProperties = {
    width: getSize(width),
    height: getSize(height),
  }

  // Text variant with multiple lines
  if (variant === 'text') {
    return (
      <div className={`loading-skeleton-text ${className}`}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="loading-skeleton loading-skeleton--text"
            style={{
              width: i === lines - 1 && lines > 1 ? '75%' : getSize(width),
              height: getSize(height) || '1em',
            }}
          />
        ))}
      </div>
    )
  }

  // Circular variant
  if (variant === 'circular') {
    return (
      <div
        className={`loading-skeleton loading-skeleton--circular ${className}`}
        style={{
          width: getSize(width) || '40px',
          height: getSize(height) || getSize(width) || '40px',
        }}
      />
    )
  }

  // Card and panel variants
  return (
    <div
      className={`loading-skeleton loading-skeleton--${variant} ${className}`}
      style={style}
    />
  )
}

/**
 * LoadingSkeletonGroup Component
 * Convenience component for common loading patterns
 */
export interface LoadingSkeletonGroupProps {
  /** Type of loading pattern */
  type: 'list' | 'card' | 'stats' | 'paragraph'
  /** Number of items */
  count?: number
  /** Optional className */
  className?: string
}

export function LoadingSkeletonGroup({
  type,
  count = 3,
  className = '',
}: LoadingSkeletonGroupProps) {
  if (type === 'list') {
    return (
      <div className={`loading-skeleton-group loading-skeleton-group--list ${className}`}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="loading-skeleton-list-item">
            <LoadingSkeleton variant="circular" width={40} height={40} />
            <div className="loading-skeleton-list-content">
              <LoadingSkeleton variant="text" width="60%" />
              <LoadingSkeleton variant="text" width="40%" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className={`loading-skeleton-group loading-skeleton-group--card ${className}`}>
        {Array.from({ length: count }, (_, i) => (
          <LoadingSkeleton key={i} variant="card" height={200} />
        ))}
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div className={`loading-skeleton-group loading-skeleton-group--stats ${className}`}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="loading-skeleton-stat">
            <LoadingSkeleton variant="text" width="50%" />
            <LoadingSkeleton variant="text" width="70%" height={32} />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'paragraph') {
    return (
      <div className={`loading-skeleton-group loading-skeleton-group--paragraph ${className}`}>
        <LoadingSkeleton variant="text" lines={count} />
      </div>
    )
  }

  return null
}
