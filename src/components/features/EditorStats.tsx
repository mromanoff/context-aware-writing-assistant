import type { TextStatistics } from '../../hooks/useTextAnalysis'
import './EditorStats.css'

export interface EditorStatsProps {
  /** Text statistics to display */
  stats: TextStatistics
  /** Whether to show in compact mode */
  compact?: boolean
  /** Custom class name */
  className?: string
}

export function EditorStats({ stats, compact = false, className = '' }: EditorStatsProps) {
  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  return (
    <div className={`editor-stats ${compact ? 'editor-stats--compact' : ''} ${className}`}>
      <div className="editor-stats-grid">
        <div className="editor-stat">
          <span className="editor-stat-label">Words</span>
          <span className="editor-stat-value">{formatNumber(stats.wordCount)}</span>
        </div>

        <div className="editor-stat">
          <span className="editor-stat-label">Characters</span>
          <span className="editor-stat-value">{formatNumber(stats.characterCount)}</span>
        </div>

        {!compact && (
          <>
            <div className="editor-stat">
              <span className="editor-stat-label">Sentences</span>
              <span className="editor-stat-value">{formatNumber(stats.sentenceCount)}</span>
            </div>

            <div className="editor-stat">
              <span className="editor-stat-label">Paragraphs</span>
              <span className="editor-stat-value">{formatNumber(stats.paragraphCount)}</span>
            </div>

            <div className="editor-stat">
              <span className="editor-stat-label">Reading Time</span>
              <span className="editor-stat-value">
                {stats.readingTime} {stats.readingTime === 1 ? 'min' : 'mins'}
              </span>
            </div>

            <div className="editor-stat">
              <span className="editor-stat-label">Avg Words/Sentence</span>
              <span className="editor-stat-value">
                {stats.avgWordsPerSentence > 0 ? stats.avgWordsPerSentence : '—'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* EditorStatsBar - Horizontal compact version for bottom of editor */
export interface EditorStatsBarProps {
  /** Text statistics to display */
  stats: TextStatistics
  /** Custom class name */
  className?: string
}

export function EditorStatsBar({ stats, className = '' }: EditorStatsBarProps) {
  return (
    <div className={`editor-stats-bar ${className}`}>
      <span className="editor-stats-bar-item">
        <strong>{stats.wordCount.toLocaleString()}</strong> words
      </span>
      <span className="editor-stats-bar-separator" aria-hidden="true">
        •
      </span>
      <span className="editor-stats-bar-item">
        <strong>{stats.characterCount.toLocaleString()}</strong> characters
      </span>
      <span className="editor-stats-bar-separator" aria-hidden="true">
        •
      </span>
      <span className="editor-stats-bar-item">
        <strong>{stats.sentenceCount.toLocaleString()}</strong> sentences
      </span>
      {stats.readingTime > 0 && (
        <>
          <span className="editor-stats-bar-separator" aria-hidden="true">
            •
          </span>
          <span className="editor-stats-bar-item">
            <strong>{stats.readingTime}</strong> min read
          </span>
        </>
      )}
    </div>
  )
}
