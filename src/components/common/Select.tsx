import { SelectHTMLAttributes, useId } from 'react'
import './Select.css'

export interface SelectOption<T = string> {
  /** Display label for the option */
  label: string
  /** Value for the option */
  value: T
  /** Whether the option is disabled */
  disabled?: boolean
}

export interface SelectProps<T = string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  /** Label for the select */
  label?: string
  /** Array of options */
  options: SelectOption<T>[]
  /** Current selected value */
  value: T
  /** Callback when value changes */
  onChange: (value: T) => void
  /** Error message to display */
  error?: string
  /** Helper text to display below the select */
  helperText?: string
  /** Whether the label is visually hidden (still accessible to screen readers) */
  hideLabel?: boolean
  /** Placeholder text */
  placeholder?: string
}

export function Select<T extends string | number = string>({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  hideLabel = false,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  ...props
}: SelectProps<T>) {
  const id = useId()
  const helperId = useId()
  const errorId = useId()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    // Find the option to get the original typed value
    const option = options.find((opt) => String(opt.value) === selectedValue)
    if (option) {
      onChange(option.value)
    }
  }

  return (
    <div className={`select-wrapper ${error ? 'select-wrapper--error' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`select-label ${hideLabel ? 'sr-only' : ''} ${required ? 'select-label--required' : ''}`}
        >
          {label}
          {required && <span className="select-required" aria-label="required">*</span>}
        </label>
      )}

      <div className="select-container">
        <select
          id={id}
          value={String(value)}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className="select"
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={String(option.value)}
              value={String(option.value)}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span className="select-icon" aria-hidden="true">
          ▼
        </span>
      </div>

      {error && (
        <span id={errorId} className="select-error" role="alert">
          {error}
        </span>
      )}

      {helperText && !error && (
        <span id={helperId} className="select-helper">
          {helperText}
        </span>
      )}
    </div>
  )
}
