import { useState, cloneElement, isValidElement, type ReactNode } from 'react'
import { MobileDrawer } from './MobileDrawer'
import { SkipLink } from '../common'
import { useMediaQuery } from '../../hooks'
import './MainLayout.css'

export interface MainLayoutProps {
  /** Header component */
  header: ReactNode
  /** Sidebar component */
  sidebar: ReactNode
  /** Main content area */
  children: ReactNode
  /** Footer component */
  footer: ReactNode
}

export function MainLayout({ header, sidebar, children, footer }: MainLayoutProps) {
  const { isMobile } = useMediaQuery()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Clone header with onMenuToggle prop if it's a valid React element
  const headerWithProps = isValidElement(header)
    ? cloneElement(header, { onMenuToggle: () => setIsMobileMenuOpen(!isMobileMenuOpen) } as any)
    : header

  return (
    <div className="main-layout">
      {/* Skip to main content link for accessibility */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      {/* Header */}
      {headerWithProps}

      {/* Main content area with sidebar */}
      <div className="layout-body">
        <div className="container">
          <div className="layout-grid">
            {/* Main content */}
            <main id="main-content" className="main-content" role="main">
              {children}
            </main>

            {/* Sidebar - Desktop */}
            {!isMobile && (
              <aside className="layout-sidebar">
                {sidebar}
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile Drawer */}
      {isMobile && (
        <MobileDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          position="right"
        >
          {sidebar}
        </MobileDrawer>
      )}

      {/* Footer */}
      {footer}
    </div>
  )
}
