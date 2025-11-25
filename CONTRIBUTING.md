# Contributing to Context-Aware Writing Assistant

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- OpenAI API key (for testing AI features)
- Familiarity with React, TypeScript, and Vite

### Development Setup

1. Fork the repository on GitHub

2. Clone your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/context-aware-writing-assistant.git
   cd context-aware-writing-assistant
   ```

3. Add upstream remote
   ```bash
   git remote add upstream https://github.com/mromanoff/context-aware-writing-assistant.git
   ```

4. Install dependencies
   ```bash
   npm install
   ```

5. Create `.env` file
   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env
   ```

6. Start development server
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes

### 2. Make Your Changes

- Follow the existing code style
- Write clear, descriptive commit messages
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Commit Your Changes

Use descriptive commit messages:

```bash
git add .
git commit -m "Add feature: description of what you added"
```

Good commit message examples:
- `Add dark mode toggle to settings`
- `Fix text analysis bug with empty strings`
- `Update README with deployment instructions`
- `Refactor Button component for better accessibility`

### 4. Keep Your Branch Updated

Regularly sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Run Tests

Ensure all tests pass before submitting:

```bash
npm run lint        # Type checking
npm test -- --run   # Run all tests
npm run build       # Ensure build succeeds
```

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### Before Submitting

- ✅ Tests pass locally
- ✅ Code follows project style
- ✅ Documentation is updated
- ✅ No TypeScript errors
- ✅ Commits are clear and descriptive

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing done

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests passing
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Export types alongside components

### React Components

- Use functional components with hooks
- Follow component naming: `PascalCase`
- Keep components focused and single-purpose
- Document props with TypeScript interfaces

Example:
```typescript
interface ButtonProps {
  /** Button text */
  children: ReactNode
  /** Click handler */
  onClick?: () => void
  /** Button variant */
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  // Component implementation
}
```

### CSS

- Use CSS Custom Properties for theming
- Follow BEM naming for components
- Keep selectors specific to component
- Support dark mode and accessibility

### Testing

- Write tests for new features
- Test user behavior, not implementation
- Mock external APIs
- Aim for >80% coverage on utilities

Example test:
```typescript
describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── features/        # Feature components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── services/            # API integrations
├── contexts/            # React contexts
└── types/               # TypeScript types
```

### Adding New Components

1. Create component file in appropriate directory
2. Create accompanying `.css` file
3. Add tests in `__tests__` subdirectory
4. Export from `index.ts` in that directory
5. Document props and usage

### Adding New Hooks

1. Create hook file in `src/hooks/`
2. Add tests in `src/hooks/__tests__/`
3. Export from `src/hooks/index.ts`
4. Document parameters and return type

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/environment details

### Feature Requests

Include:
- Clear description of feature
- Use case and benefits
- Possible implementation approach
- Any related issues or PRs

## Questions?

- Open an issue for questions
- Check existing issues first
- Be clear and specific
- Provide context

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing! 🎉
