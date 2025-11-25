import { useState } from 'react'
import { useWritingMode } from '../../hooks'
import { ReadabilityScore, ToneIndicator } from '../features'
import type { Tone } from '../../utils/textAnalysis'
import './Sidebar.css'

export interface WritingStats {
  /** Total word count */
  wordCount: number
  /** Total character count (with spaces) */
  characterCount: number
  /** Total character count (without spaces) */
  characterCountNoSpaces: number
  /** Number of sentences */
  sentenceCount: number
  /** Number of paragraphs */
  paragraphCount: number
  /** Readability score (0-100, higher is easier) */
  readabilityScore: number
  /** Detected tone */
  tone: Tone
  /** Estimated reading time in minutes */
  readingTime: number
  /** Grade level */
  gradeLevel: number
}

export interface SidebarProps {
  /** Writing statistics to display */
  stats: WritingStats
  /** Callback when collapse state changes */
  onToggleCollapse?: () => void
}

export function Sidebar({ stats, onToggleCollapse }: SidebarProps) {
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false)
  const { currentMode } = useWritingMode()

  const handleToggle = () => {
    setIsMobileCollapsed(!isMobileCollapsed)
    onToggleCollapse?.()
  }

  return (
    <aside
      className={`sidebar ${isMobileCollapsed ? 'collapsed' : ''}`}
      aria-label="Writing statistics and metrics"
    >
      {/* Mobile Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={handleToggle}
        aria-expanded={!isMobileCollapsed}
        aria-controls="sidebar-content"
        aria-label={isMobileCollapsed ? 'Show statistics' : 'Hide statistics'}
      >
        <span className="toggle-icon" aria-hidden="true">
          {isMobileCollapsed ? '📊' : '✕'}
        </span>
        <span className="toggle-text">
          {isMobileCollapsed ? 'Show Stats' : 'Hide Stats'}
        </span>
      </button>

      <div id="sidebar-content" className="sidebar-content">
        {/* Quick Metrics */}
        <section className="metrics-section">
          <h2 className="section-title">Quick Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-label">Words</span>
              <span className="metric-value">{stats.wordCount.toLocaleString()}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Characters</span>
              <span className="metric-value">{stats.characterCount.toLocaleString()}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Sentences</span>
              <span className="metric-value">{stats.sentenceCount.toLocaleString()}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Paragraphs</span>
              <span className="metric-value">{stats.paragraphCount.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Readability Score */}
        <section className="readability-section">
          <ReadabilityScore score={stats.readabilityScore} />
        </section>

        {/* Tone Indicator */}
        <section className="tone-section">
          <ToneIndicator tone={stats.tone} targetTone={currentMode} />
        </section>

        {/* Reading Time */}
        <section className="reading-time-section">
          <div className="reading-time-card">
            <h3 className="reading-time-title">Reading Time</h3>
            <div className="reading-time-value">
              {stats.readingTime > 0 ? `${stats.readingTime} min` : '—'}
            </div>
          </div>
        </section>

        {/* Additional Details */}
        <section className="details-section">
          <h2 className="section-title">Details</h2>
          <div className="details-list">
            <div className="detail-row">
              <span className="detail-key">Characters (no spaces)</span>
              <span className="detail-value">{stats.characterCountNoSpaces.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Avg. words per sentence</span>
              <span className="detail-value">
                {stats.sentenceCount > 0
                  ? Math.round((stats.wordCount / stats.sentenceCount) * 10) / 10
                  : '—'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </aside>
  )
}
