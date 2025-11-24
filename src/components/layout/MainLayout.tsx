import type { ReactNode } from 'react'
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
  return (
    <div className="main-layout">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Header */}
      {header}

      {/* Main content area with sidebar */}
      <div className="layout-body">
        <div className="container">
          <div className="layout-grid">
            {/* Main content */}
            <main id="main-content" className="main-content" role="main">
              {children}
            </main>

            {/* Sidebar */}
            {sidebar}
          </div>
        </div>
      </div>

      {/* Footer */}
      {footer}
    </div>
  )
}
