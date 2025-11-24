import { TextareaHTMLAttributes, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import type { WritingMode } from '../../types'
import './TextEditor.css'

export interface TextEditorProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /** Current text value */
  value: string
  /** Callback when text changes */
  onChange: (value: string) => void
  /** Writing mode for context-aware placeholder */
  mode?: WritingMode
  /** Whether the editor is disabled */
  disabled?: boolean
  /** Custom placeholder text */
  placeholder?: string
  /** Minimum height in pixels */
  minHeight?: number
  /** Maximum height in pixels (for auto-grow) */
  maxHeight?: number
  /** Whether to auto-focus on mount */
  autoFocus?: boolean
  /** Whether to show auto-save indicator */
  showAutoSave?: boolean
  /** Auto-save status */
  autoSaveStatus?: 'idle' | 'saving' | 'saved' | 'error'
}

export interface TextEditorHandle {
  focus: () => void
  blur: () => void
  getSelectionRange: () => { start: number; end: number }
}

const defaultPlaceholders: Record<WritingMode, string> = {
  technical: 'Write technical documentation, guides, or specifications...',
  creative: 'Let your creativity flow. Write stories, poems, or creative content...',
  business: 'Compose professional business communication...',
  casual: 'Write in a casual, conversational tone...',
}

export const TextEditor = forwardRef<TextEditorHandle, TextEditorProps>(
  (
    {
      value,
      onChange,
      mode = 'casual',
      disabled = false,
      placeholder,
      minHeight = 300,
      maxHeight = 800,
      autoFocus = false,
      showAutoSave = false,
      autoSaveStatus = 'idle',
      className = '',
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      blur: () => textareaRef.current?.blur(),
      getSelectionRange: () => ({
        start: textareaRef.current?.selectionStart ?? 0,
        end: textareaRef.current?.selectionEnd ?? 0,
      }),
    }))

    // Auto-focus on mount if requested
    useEffect(() => {
      if (autoFocus && textareaRef.current) {
        textareaRef.current.focus()
      }
    }, [autoFocus])

    // Auto-grow textarea height based on content
    useEffect(() => {
      const textarea = textareaRef.current
      if (!textarea) return

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'

      // Calculate new height
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    }, [value, minHeight, maxHeight])

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value)
    }

    const getAutoSaveLabel = () => {
      switch (autoSaveStatus) {
        case 'saving':
          return 'Saving...'
        case 'saved':
          return 'Saved'
        case 'error':
          return 'Save failed'
        default:
          return ''
      }
    }

    const effectivePlaceholder = placeholder || defaultPlaceholders[mode]

    return (
      <div className={`text-editor ${className}`}>
        {showAutoSave && autoSaveStatus !== 'idle' && (
          <div
            className={`text-editor-autosave text-editor-autosave--${autoSaveStatus}`}
            role="status"
            aria-live="polite"
          >
            <span className="text-editor-autosave-icon" aria-hidden="true">
              {autoSaveStatus === 'saving' && '⏳'}
              {autoSaveStatus === 'saved' && '✓'}
              {autoSaveStatus === 'error' && '⚠'}
            </span>
            <span className="text-editor-autosave-label">{getAutoSaveLabel()}</span>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={effectivePlaceholder}
          className="text-editor-textarea"
          style={{ minHeight: `${minHeight}px` }}
          spellCheck="true"
          aria-label="Text editor"
          {...props}
        />
      </div>
    )
  }
)

TextEditor.displayName = 'TextEditor'
