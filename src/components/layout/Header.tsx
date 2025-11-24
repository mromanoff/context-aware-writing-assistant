import type { WritingMode } from '../../types'
import './Header.css'

export interface HeaderProps {
  /** Current writing mode */
  writingMode: WritingMode
  /** Callback when writing mode changes */
  onWritingModeChange: (mode: WritingMode) => void
  /** Current theme */
  theme?: 'light' | 'dark' | 'auto'
  /** Callback when theme changes (optional for now) */
  onThemeChange?: (theme: 'light' | 'dark' | 'auto') => void
}

export function Header({
  writingMode,
  onWritingModeChange,
  theme = 'auto',
  onThemeChange,
}: HeaderProps) {
  return (
    <header className="header" role="banner">
      <div className="container">
        <div className="header-content">
          <div className="header-logo">
            <h1 className="header-title">
              <span className="header-icon" aria-hidden="true">✍️</span>
              Writing Assistant
            </h1>
          </div>

          <nav className="header-nav" aria-label="Main navigation">
            <div className="header-controls">
              {/* Writing Mode Selector */}
              <div className="mode-selector">
                <label htmlFor="writing-mode" className="control-label">
                  Mode
                </label>
                <select
                  id="writing-mode"
                  value={writingMode}
                  onChange={(e) => onWritingModeChange(e.target.value as WritingMode)}
                  className="mode-select"
                  aria-label="Select writing mode"
                >
                  <option value="technical">Technical</option>
                  <option value="creative">Creative</option>
                  <option value="business">Business</option>
                  <option value="casual">Casual</option>
                </select>
              </div>

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
