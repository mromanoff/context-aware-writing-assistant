import { useMemo } from 'react'
import { WritingProvider } from './contexts'
import { MainLayout, Header, Sidebar, Footer } from './components/layout'
import type { WritingStats } from './components/layout'
import { TextEditor, SuggestionsPanel } from './components/features'
import { ErrorBoundary } from './components/common'
import { useTextAnalysis, useWritingMode, useSuggestions, useDebounce } from './hooks'
import { calculateReadability, analyzeTone } from './utils/textAnalysis'
import './App.css'

/**
 * Main app content component
 * Uses WritingContext for state management
 */
function AppContent() {
  const { currentMode, text, setText } = useWritingMode()

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
  })

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
  }

  return (
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
          value={text}
          onChange={setText}
          mode={currentMode}
          minHeight={400}
          maxHeight={800}
          autoFocus
        />
      </section>
    </MainLayout>
  )
}

/**
 * App component with context provider and error boundary
 */
function App() {
  return (
    <ErrorBoundary context="App">
      <WritingProvider initialMode="casual" initialText="">
        <AppContent />
      </WritingProvider>
    </ErrorBoundary>
  )
}

export default App
