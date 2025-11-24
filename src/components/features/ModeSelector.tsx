import { useWritingMode } from '../../hooks'
import { getAllModeConfigs, getModeConfig } from '../../utils/modeConfig'
import './ModeSelector.css'

export interface ModeSelectorProps {
  /** Optional CSS class name */
  className?: string
  /** Whether to show mode descriptions */
  showDescription?: boolean
  /** Display variant */
  variant?: 'default' | 'compact'
}

export function ModeSelector({
  className = '',
  showDescription = false,
  variant = 'default',
}: ModeSelectorProps) {
  const { currentMode, setMode } = useWritingMode()
  const modes = getAllModeConfigs()
  const currentConfig = getModeConfig(currentMode)

  return (
    <div className={`mode-selector mode-selector--${variant} ${className}`}>
      <label htmlFor="mode-selector-dropdown" className="mode-selector-label">
        Writing Mode
      </label>

      <div className="mode-selector-dropdown-wrapper">
        <select
          id="mode-selector-dropdown"
          value={currentMode}
          onChange={(e) => setMode(e.target.value as typeof currentMode)}
          className="mode-selector-dropdown"
          aria-label="Select writing mode"
        >
          {modes.map((config) => (
            <option key={config.mode} value={config.mode}>
              {config.icon} {config.label}
            </option>
          ))}
        </select>

        {/* Current mode indicator */}
        <div
          className="mode-selector-indicator"
          style={{
            backgroundColor: currentConfig.backgroundColor,
            borderColor: currentConfig.borderColor,
          }}
        >
          <span className="mode-selector-icon" aria-hidden="true">
            {currentConfig.icon}
          </span>
          <span className="mode-selector-text">{currentConfig.label}</span>
        </div>
      </div>

      {showDescription && (
        <p className="mode-selector-description">{currentConfig.description}</p>
      )}
    </div>
  )
}

/**
 * Mode Pills - Alternative horizontal layout
 */
export interface ModePillsProps {
  /** Optional CSS class name */
  className?: string
}

export function ModePills({ className = '' }: ModePillsProps) {
  const { currentMode, setMode } = useWritingMode()
  const modes = getAllModeConfigs()

  return (
    <div className={`mode-pills ${className}`} role="radiogroup" aria-label="Writing mode">
      {modes.map((config) => {
        const isActive = config.mode === currentMode

        return (
          <button
            key={config.mode}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setMode(config.mode)}
            className={`mode-pill ${isActive ? 'mode-pill--active' : ''}`}
            style={{
              backgroundColor: isActive ? config.backgroundColor : 'transparent',
              borderColor: isActive ? config.borderColor : 'var(--color-border)',
              color: isActive ? config.color : 'var(--color-text-secondary)',
            }}
            title={config.description}
          >
            <span className="mode-pill-icon" aria-hidden="true">
              {config.icon}
            </span>
            <span className="mode-pill-label">{config.label}</span>
          </button>
        )
      })}
    </div>
  )
}
