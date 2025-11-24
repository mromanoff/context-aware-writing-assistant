import { useState } from 'react'
import type { WritingMode } from './types'
import { MainLayout, Header, Sidebar, Footer } from './components/layout'
import type { WritingStats } from './components/layout'
import { TextEditor } from './components/features'
import { useTextAnalysis } from './hooks'
import './App.css'

function App() {
  const [writingMode, setWritingMode] = useState<WritingMode>('casual')
  const [text, setText] = useState('')

  // Get real-time text analysis
  const textStats = useTextAnalysis(text)

  // Combine with additional stats (readability, tone, grade level will be added in later steps)
  const stats: WritingStats = {
    ...textStats,
    readabilityScore: 0, // Will be implemented in later step
    tone: 'neutral', // Will be implemented in later step
    gradeLevel: 0, // Will be implemented in later step
  }

  return (
    <MainLayout
      header={
        <Header
          writingMode={writingMode}
          onWritingModeChange={setWritingMode}
        />
      }
      sidebar={<Sidebar stats={stats} />}
      footer={<Footer />}
    >
      <section className="editor-section" aria-label="Text editor">
        <h2 className="sr-only">Write your text</h2>
        <TextEditor
          value={text}
          onChange={setText}
          mode={writingMode}
          minHeight={400}
          maxHeight={800}
          autoFocus
        />
      </section>
    </MainLayout>
  )
}

export default App
