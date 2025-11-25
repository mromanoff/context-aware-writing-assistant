# Context-Aware Writing Assistant

A modern, real-time writing assistant that provides AI-powered suggestions and metrics tailored to your writing mode. Built with React, TypeScript, and OpenAI.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-ISC-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)]()
[![React](https://img.shields.io/badge/React-19.2-blue)]()

## Features

- **Context-Aware Modes**: Switch between Technical, Creative, Business, and Casual writing modes
- **Real-Time Analysis**: Live word count, readability scores, and tone detection
- **AI-Powered Suggestions**: Get intelligent writing suggestions powered by OpenAI
- **Auto-Save**: Automatic text persistence to localStorage with save indicators
- **Accessibility First**: WCAG AA compliant with keyboard shortcuts and screen reader support
- **Responsive Design**: Fully responsive from mobile to desktop
- **Toast Notifications**: Visual feedback for all user actions
- **Smooth Animations**: Polished micro-interactions with respect for `prefers-reduced-motion`
- **Comprehensive Testing**: 92% test coverage with Vitest and Testing Library

## Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **TypeScript 5.9** - Type safety and developer experience
- **Vite 7** - Fast build tool and dev server
- **CSS Custom Properties** - Themeable design system

### AI & Analysis
- **OpenAI API** - GPT-powered suggestions and analysis
- **Custom Text Analysis** - Flesch Reading Ease, tone detection, complexity metrics

### Testing
- **Vitest** - Fast unit test runner
- **Testing Library** - Component and integration testing
- **jsdom** - DOM testing environment

### Development
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## Prerequisites

- **Node.js** 18+ and npm
- **OpenAI API Key** - Get one at [platform.openai.com](https://platform.openai.com)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mromanoff/context-aware-writing-assistant.git
   cd context-aware-writing-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

## Running Locally

### Development Mode
```bash
npm run dev
```
Opens at [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
npm run build
```
Outputs to `dist/` directory

### Preview Production Build
```bash
npm run preview
```

### Run Tests
```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run coverage
```

### Type Checking
```bash
npm run lint
```

## Environment Variables

Create a `.env` file with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | Yes |

**Note**: Variables must be prefixed with `VITE_` to be accessible in the Vite frontend.

## Project Structure

```
context-aware-writing-assistant/
├── src/
│   ├── components/          # React components
│   │   ├── common/          # Reusable UI components
│   │   ├── features/        # Feature-specific components
│   │   └── layout/          # Layout components
│   ├── contexts/            # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── services/            # External service integrations
│   ├── styles/              # Global styles and design tokens
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── __tests__/           # Integration tests
│   └── test/                # Test setup and utilities
├── public/                  # Static assets
├── dist/                    # Production build output
├── .env.example             # Example environment variables
├── vitest.config.ts         # Vitest configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
```

## API Key Setup

### Getting an OpenAI API Key

1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and add it to your `.env` file

### Security Notes

- **Never commit your `.env` file** - It's already in `.gitignore`
- **Never share your API key** publicly
- **Set usage limits** in your OpenAI dashboard
- **Monitor usage** to avoid unexpected charges

## Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Push code to GitHub
   - Import project in [vercel.com](https://vercel.com)
   - Add `VITE_OPENAI_API_KEY` in Environment Variables
   - Deploy

3. **Or deploy via CLI**
   ```bash
   npm run deploy
   ```

### Deploy to Netlify

1. Build the project
   ```bash
   npm run build
   ```

2. Deploy `dist/` folder to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

## Usage

### Writing Modes

Switch between different writing contexts:
- **Technical**: For documentation, code comments, technical writing
- **Creative**: For stories, creative content, marketing copy
- **Business**: For emails, reports, professional communication
- **Casual**: For blog posts, social media, informal writing

### Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save document
- `Ctrl/Cmd + /` - Focus editor
- `Tab` - Navigate interface
- `Enter` - Activate buttons and controls

### Getting Suggestions

1. Type at least 100 characters
2. Wait 3 seconds for AI analysis
3. View suggestions in the right panel
4. Click "Apply" to accept or "Dismiss" to ignore

## Troubleshooting

### "API key is missing" error
- Ensure `.env` file exists in root directory
- Verify the variable name is `VITE_OPENAI_API_KEY`
- Restart the dev server after adding the key

### Tests failing
- Run `npm install` to ensure all dependencies are installed
- Clear cache: `rm -rf node_modules/.vite`
- Run tests: `npm test -- --run`

### Build errors
- Check TypeScript errors: `npm run lint`
- Ensure all dependencies are installed
- Check Node.js version (18+ required)

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test -- --run`
6. Commit with descriptive messages
7. Push and create a Pull Request

## Testing

This project uses Vitest and Testing Library for comprehensive testing:

- **Unit Tests**: Test individual functions and utilities
- **Component Tests**: Test React components in isolation
- **Integration Tests**: Test full user workflows
- **Coverage Goal**: >80% for utility functions

Run the test suite:
```bash
npm test
```

## Known Issues

- Suggestions require minimum 100 characters
- OpenAI API rate limits may affect suggestion frequency
- Some animations disabled for users with `prefers-reduced-motion`

## License

ISC © 2025 Context-Aware Writing Assistant

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [OpenAI](https://openai.com/)
- Styled with CSS Custom Properties
- Icons from Unicode Emoji

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/mromanoff/context-aware-writing-assistant/issues)
- Check existing issues for solutions

---

Made with ✍️ by the Context-Aware Writing Assistant team
