import { WritingProvider } from './contexts'
import { MainLayout, Header, Sidebar, Footer } from './components/layout'
import type { WritingStats } from './components/layout'
import { TextEditor, SuggestionsPanel } from './components/features'
import { useTextAnalysis, useWritingMode, useSuggestions } from './hooks'
import './App.css'

/**
 * Main app content component
 * Uses WritingContext for state management
 */
function AppContent() {
  const { currentMode, text, setText } = useWritingMode()

  // Get real-time text analysis
  const textStats = useTextAnalysis(text)

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

  // Combine with additional stats (readability, tone, grade level will be added in later steps)
  const stats: WritingStats = {
    ...textStats,
    readabilityScore: 0, // Will be implemented in later step
    tone: 'neutral', // Will be implemented in later step
    gradeLevel: 0, // Will be implemented in later step
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
 * App component with context provider
 */
function App() {
  return (
    <WritingProvider initialMode="casual" initialText="">
      <AppContent />
    </WritingProvider>
  )
}

export default App
