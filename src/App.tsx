import { useState } from 'react'
import type { WritingMode } from './types'
import { MainLayout, Header, Sidebar, Footer } from './components/layout'
import type { WritingStats } from './components/layout'
import './App.css'

function App() {
  const [writingMode, setWritingMode] = useState<WritingMode>('casual')

  // Mock stats for now - will be replaced with real analysis later
  const mockStats: WritingStats = {
    wordCount: 0,
    characterCount: 0,
    characterCountNoSpaces: 0,
    sentenceCount: 0,
    paragraphCount: 0,
    readabilityScore: 0,
    tone: 'neutral',
    readingTime: 0,
    gradeLevel: 0,
  }

  return (
    <MainLayout
      header={
        <Header
          writingMode={writingMode}
          onWritingModeChange={setWritingMode}
        />
      }
      sidebar={<Sidebar stats={mockStats} />}
      footer={<Footer />}
    >
      <section className="editor-section" aria-label="Text editor">
        <h2 className="sr-only">Write your text</h2>
        <div className="editor-container">
          <textarea
            className="editor"
            placeholder={`Start writing in ${writingMode} mode...`}
            aria-label="Text editor"
            spellCheck="false"
          />
        </div>
      </section>
    </MainLayout>
  )
}

export default App
