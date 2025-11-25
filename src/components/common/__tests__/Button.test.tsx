import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    it('renders primary variant by default', () => {
      render(<Button>Primary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('button--primary')
    })

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('button--secondary')
    })

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('button--ghost')
    })

    it('renders medium size by default', () => {
      render(<Button>Medium</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('button--medium')
    })

    it('renders small size', () => {
      render(<Button size="small">Small</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('button--small')
    })

    it('renders large size', () => {
      render(<Button size="large">Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('button--large')
    })

    it('renders full width', () => {
      render(<Button fullWidth>Full Width</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('button--full-width')
    })

    it('renders with start icon', () => {
      render(<Button startIcon={<span data-testid="start-icon">🚀</span>}>With Icon</Button>)
      expect(screen.getByTestId('start-icon')).toBeInTheDocument()
    })

    it('renders with end icon', () => {
      render(<Button endIcon={<span data-testid="end-icon">→</span>}>With Icon</Button>)
      expect(screen.getByTestId('end-icon')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Click handlers', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button')

      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(
        <Button disabled onClick={handleClick}>
          Click me
        </Button>
      )
      const button = screen.getByRole('button')

      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(
        <Button loading onClick={handleClick}>
          Click me
        </Button>
      )
      const button = screen.getByRole('button')

      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('has aria-disabled attribute when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('is disabled when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Loading state', () => {
    it('shows loading spinner when loading', () => {
      render(<Button loading>Loading</Button>)
      const spinner = document.querySelector('.button-spinner')
      expect(spinner).toBeInTheDocument()
    })

    it('has aria-busy attribute when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
    })

    it('hides icons when loading', () => {
      render(
        <Button loading startIcon={<span data-testid="icon">🚀</span>}>
          Loading
        </Button>
      )
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    })

    it('still shows button text when loading', () => {
      render(<Button loading>Loading Text</Button>)
      expect(screen.getByText(/loading text/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('is keyboard accessible', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Keyboard</Button>)
      const button = screen.getByRole('button')

      button.focus()
      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalled()
    })

    it('has proper role', () => {
      render(<Button>Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('supports custom aria-label', () => {
      render(<Button aria-label="Custom label">Button</Button>)
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(<Button aria-describedby="description">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'description')
    })
  })

  describe('Forwarded ref', () => {
    it('forwards ref to button element', () => {
      const ref = vi.fn()
      render(<Button ref={ref}>Button</Button>)
      expect(ref).toHaveBeenCalled()
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('HTML attributes', () => {
    it('passes through type attribute', () => {
      render(<Button type="submit">Submit</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('passes through name attribute', () => {
      render(<Button name="my-button">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('name', 'my-button')
    })

    it('passes through form attribute', () => {
      render(<Button form="my-form">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('form', 'my-form')
    })
  })
})
