import { ModeSelector, AutoSaveIndicator } from '../features'
import { useWritingMode, useMediaQuery } from '../../hooks'
import './Header.css'

export interface HeaderProps {
  /** Current theme */
  theme?: 'light' | 'dark' | 'auto'
  /** Callback when theme changes (optional for now) */
  onThemeChange?: (theme: 'light' | 'dark' | 'auto') => void
  /** Callback when mobile menu is toggled */
  onMenuToggle?: () => void
}

export function Header({ theme = 'auto', onThemeChange, onMenuToggle }: HeaderProps) {
  const { isSaving, lastSaved } = useWritingMode()
  const { isMobile } = useMediaQuery()

  return (
    <header className="header" role="banner">
      <div className="container">
        <div className="header-content">
          {/* Mobile menu button */}
          {isMobile && onMenuToggle && (
            <button
              type="button"
              onClick={onMenuToggle}
              className="header-menu-button"
              aria-label="Toggle navigation menu"
              aria-expanded="false"
            >
              <span className="header-menu-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          )}

          <div className="header-logo">
            <h1 className="header-title">
              <span className="header-icon" aria-hidden="true">✍️</span>
              <span className="header-title-text">Writing Assistant</span>
            </h1>
            {/* Auto-save indicator */}
            <AutoSaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
          </div>

          <nav className="header-nav" aria-label="Main navigation">
            <div className="header-controls">
              {/* Writing Mode Selector - now uses context */}
              <ModeSelector variant="compact" />

              {/* Theme Toggle (optional for now) */}
              {onThemeChange && (
                <div className="theme-toggle">
                  <label htmlFor="theme-select" className="control-label">
                    Theme
                  </label>
                  <select
                    id="theme-select"
                    value={theme}
                    onChange={(e) => onThemeChange(e.target.value as 'light' | 'dark' | 'auto')}
                    className="theme-select"
                    aria-label="Select theme"
                  >
                    <option value="auto">Auto</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
