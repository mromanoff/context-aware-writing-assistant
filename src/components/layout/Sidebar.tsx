import { useState } from 'react'
import type { Tone } from '../../types'
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

  const handleToggle = () => {
    setIsMobileCollapsed(!isMobileCollapsed)
    onToggleCollapse?.()
  }

  const getReadabilityLabel = (score: number): string => {
    if (score >= 90) return 'Very Easy'
    if (score >= 80) return 'Easy'
    if (score >= 70) return 'Fairly Easy'
    if (score >= 60) return 'Standard'
    if (score >= 50) return 'Fairly Difficult'
    if (score >= 30) return 'Difficult'
    return 'Very Difficult'
  }

  const getReadabilityColor = (score: number): string => {
    if (score >= 80) return 'var(--color-success-600)'
    if (score >= 60) return 'var(--color-primary-600)'
    if (score >= 40) return 'var(--color-warning-600)'
    return 'var(--color-error-600)'
  }

  const getToneEmoji = (tone: Tone): string => {
    const toneEmojis: Record<Tone, string> = {
      formal: '🎩',
      informal: '😊',
      professional: '💼',
      conversational: '💬',
      academic: '🎓',
      persuasive: '🎯',
      neutral: '📝',
    }
    return toneEmojis[tone] || '📝'
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
          <h2 className="section-title">Readability</h2>
          <div className="readability-card">
            <div className="readability-score-container">
              <div
                className="readability-score"
                style={{ color: getReadabilityColor(stats.readabilityScore) }}
              >
                {stats.readabilityScore > 0 ? Math.round(stats.readabilityScore) : '—'}
              </div>
              <div className="readability-label">
                {stats.readabilityScore > 0 ? getReadabilityLabel(stats.readabilityScore) : 'N/A'}
              </div>
            </div>
            <div className="readability-details">
              <div className="detail-item">
                <span className="detail-label">Grade Level</span>
                <span className="detail-value">
                  {stats.gradeLevel > 0 ? `${Math.round(stats.gradeLevel)}th` : '—'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Reading Time</span>
                <span className="detail-value">
                  {stats.readingTime > 0 ? `${stats.readingTime} min` : '—'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tone Indicator */}
        <section className="tone-section">
          <h2 className="section-title">Tone Analysis</h2>
          <div className="tone-card">
            <span className="tone-emoji" aria-hidden="true">
              {getToneEmoji(stats.tone)}
            </span>
            <span className="tone-label">{stats.tone.charAt(0).toUpperCase() + stats.tone.slice(1)}</span>
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
