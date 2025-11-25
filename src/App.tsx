import { useMemo, useRef, useState, useEffect } from 'react'
import { WritingProvider } from './contexts'
import { MainLayout, Header, Sidebar, Footer } from './components/layout'
import type { WritingStats } from './components/layout'
import { TextEditor, SuggestionsPanel } from './components/features'
import type { TextEditorHandle } from './components/features'
import { ErrorBoundary, LiveRegion, ToastContainer } from './components/common'
import { useTextAnalysis, useWritingMode, useSuggestions, useDebounce, useKeyboardShortcuts, useToast, ToastProvider } from './hooks'
import { calculateReadability, analyzeTone } from './utils/textAnalysis'
import { saveText } from './services/storage.service'
import './App.css'

/**
 * Main app content component
 * Uses WritingContext for state management
 */
function AppContent() {
  const { currentMode, text, setText, isSaving, lastSaved } = useWritingMode()
  const editorRef = useRef<TextEditorHandle>(null)
  const [announcement, setAnnouncement] = useState('')
  const { toasts, showSuccess } = useToast()
  const [isInitialMount, setIsInitialMount] = useState(true)

  // Get real-time text analysis (word count, character count, etc.)
  const textStats = useTextAnalysis(text)

  // Debounce text for expensive calculations (500ms)
  const debouncedText = useDebounce(text, 500)

  // Calculate readability score with useMemo (expensive calculation)
  const readabilityScore = useMemo(() => {
    return calculateReadability(debouncedText)
  }, [debouncedText])

  // Analyze tone with useMemo
  const tone = useMemo(() => {
    return analyzeTone(debouncedText)
  }, [debouncedText])

  // Get AI-powered suggestions
  const {
    suggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
    applySuggestion,
    dismissSuggestion,
    retry,
  } = useSuggestions({
    debounceMs: 3000,
    minTextLength: 100,
    autoFetch: true, // Enable automatic suggestion fetching
  })

  // Announce when suggestions are loaded
  useEffect(() => {
    if (!suggestionsLoading && suggestions.length > 0) {
      setAnnouncement(`${suggestions.length} suggestion${suggestions.length === 1 ? '' : 's'} available`)
    }
  }, [suggestionsLoading, suggestions.length])

  // Announce when save completes
  useEffect(() => {
    if (!isSaving && lastSaved) {
      setAnnouncement('Document saved')
      showSuccess('Document saved successfully!')
    }
  }, [isSaving, lastSaved, showSuccess])

  // Show success when mode changes (skip initial mount)
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false)
    } else {
      const modeNames: Record<typeof currentMode, string> = {
        technical: 'Technical',
        creative: 'Creative',
        business: 'Business',
        casual: 'Casual',
      }
      showSuccess(`Switched to ${modeNames[currentMode]} mode`)
    }
  }, [currentMode, isInitialMount, showSuccess])

  // Combine with real-time analysis stats
  const stats: WritingStats = {
    ...textStats,
    readabilityScore,
    tone,
    gradeLevel: 0, // Can be calculated from readability score if needed
  }

  /**
   * Handle applying a suggestion
   */
  const handleApplySuggestion = (suggestion: ReturnType<typeof useSuggestions>['suggestions'][0]) => {
    const updatedText = applySuggestion(suggestion, text)
    setText(updatedText)
    setAnnouncement('Suggestion applied')
    showSuccess('Suggestion applied successfully!')
  }

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'ctrl+s',
      handler: () => {
        saveText(text)
        setAnnouncement('Document saved manually')
      },
      description: 'Save document',
      preventDefault: true,
    },
    {
      key: 'cmd+s',
      handler: () => {
        saveText(text)
        setAnnouncement('Document saved manually')
      },
      description: 'Save document (Mac)',
      preventDefault: true,
    },
    {
      key: 'ctrl+/',
      handler: () => {
        editorRef.current?.focus()
        setAnnouncement('Editor focused')
      },
      description: 'Focus editor',
      preventDefault: true,
    },
    {
      key: 'cmd+/',
      handler: () => {
        editorRef.current?.focus()
        setAnnouncement('Editor focused')
      },
      description: 'Focus editor (Mac)',
      preventDefault: true,
    },
  ])

  return (
    <>
      <MainLayout
        header={<Header />}
        sidebar={
          <>
            <Sidebar stats={stats} />
            <SuggestionsPanel
              suggestions={suggestions}
              loading={suggestionsLoading}
              error={suggestionsError || null}
              onApply={handleApplySuggestion}
              onDismiss={dismissSuggestion}
              onRetry={retry}
            />
          </>
        }
        footer={<Footer />}
      >
        <section className="editor-section" aria-label="Text editor">
          <h2 className="sr-only">Write your text</h2>
          <TextEditor
            ref={editorRef}
            value={text}
            onChange={setText}
            mode={currentMode}
            minHeight={400}
            maxHeight={800}
            autoFocus
            aria-label="Main text editor"
            aria-describedby="editor-stats"
          />
        </section>
      </MainLayout>

      {/* ARIA Live Region for announcements */}
      <LiveRegion message={announcement} politeness="polite" clearAfter={3000} />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} position="top" />
    </>
  )
}

/**
 * App component with context provider and error boundary
 */
function App() {
  return (
    <ErrorBoundary context="App">
      <ToastProvider>
        <WritingProvider initialMode="casual" initialText="">
          <AppContent />
        </WritingProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
