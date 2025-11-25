import './SkipLink.css'

export interface SkipLinkProps {
  /** Target element ID to skip to */
  href: string
  /** Link text */
  children: string
  /** Optional className */
  className?: string
}

/**
 * SkipLink Component
 * Provides a skip navigation link for keyboard users
 * Visible only when focused, allowing users to bypass navigation
 */
export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <a href={href} className={`skip-link ${className}`}>
      {children}
    </a>
  )
}
