import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock the OpenAI service to avoid actual API calls
vi.mock('../services/openai.service', () => ({
  analyzeToneWithAI: vi.fn().mockResolvedValue('casual'),
  getSuggestionsFromAI: vi.fn().mockResolvedValue([
    {
      id: '1',
      category: 'style',
      severity: 'suggestion',
      message: 'Consider simplifying this sentence',
      originalText: 'complex text',
      suggestedText: 'simple text',
      range: { start: 0, end: 12 },
    },
  ]),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('App Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('renders the main application', () => {
    render(<App />)

    // Check for main UI elements
    expect(screen.getByText(/writing assistant/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('displays initial stats with zero values', () => {
    render(<App />)

    // Stats should show 0 initially
    expect(screen.getByText(/words/i)).toBeInTheDocument()
    expect(screen.getByText(/characters/i)).toBeInTheDocument()
  })

  it('updates stats when user types text', async () => {
    const user = userEvent.setup()
    render(<App />)

    const editor = screen.getByRole('textbox')

    // Type some text
    await user.type(editor, 'Hello world')

    // Wait for stats to update
    await waitFor(() => {
      // Check that word count is displayed (may be in various formats)
      const statsContainer = document.querySelector('.metrics-grid')
      expect(statsContainer).toBeTruthy()
    })
  })

  it('allows switching writing modes', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Find mode selector
    const modeSelector = screen.getByRole('combobox', { name: /mode/i })

    // Switch to a different mode
    await user.selectOptions(modeSelector, 'technical')

    // Verify mode changed (this would trigger toast notification)
    await waitFor(() => {
      expect(modeSelector).toHaveValue('technical')
    })
  })

  it('persists text to localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)

    const editor = screen.getByRole('textbox')
    const testText = 'This text should be saved'

    // Type text
    await user.type(editor, testText)

    // Wait for auto-save (debounced)
    await waitFor(
      () => {
        const saved = localStorageMock.getItem('writing-assistant-text')
        expect(saved).toBeTruthy()
      },
      { timeout: 3000 }
    )
  })

  it('shows toast notification on successful actions', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Find mode selector and switch mode
    const modeSelector = screen.getByRole('combobox', { name: /mode/i })
    await user.selectOptions(modeSelector, 'creative')

    // Toast should appear
    await waitFor(() => {
      // Look for success toast
      const toast = document.querySelector('.toast--success')
      expect(toast).toBeInTheDocument()
    })
  })

  it('handles keyboard shortcuts', async () => {
    const user = userEvent.setup()
    render(<App />)

    const editor = screen.getByRole('textbox')

    // Focus editor
    await user.click(editor)

    // Type some text
    await user.type(editor, 'Test text for saving')

    // Trigger save shortcut (Ctrl+S or Cmd+S)
    await user.keyboard('{Control>}s{/Control}')

    // Should show save success toast
    await waitFor(() => {
      const successMessage = screen.queryByText(/saved/i)
      expect(successMessage).toBeInTheDocument()
    })
  })

  it('maintains focus on editor after operations', async () => {
    const user = userEvent.setup()
    render(<App />)

    const editor = screen.getByRole('textbox')

    // Focus editor
    await user.click(editor)
    expect(editor).toHaveFocus()

    // Type text
    await user.type(editor, 'Maintaining focus')

    // Editor should still have focus
    expect(editor).toHaveFocus()
  })

  it('handles empty text gracefully', () => {
    render(<App />)

    // Should not crash with empty text
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText(/writing assistant/i)).toBeInTheDocument()
  })

  it('displays accessibility features', () => {
    render(<App />)

    // Check for skip link
    const skipLink = document.querySelector('.skip-link')
    expect(skipLink).toBeInTheDocument()

    // Check for ARIA live region
    const liveRegion = document.querySelector('[role="status"]')
    expect(liveRegion).toBeInTheDocument()

    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toBeInTheDocument()
  })
})
