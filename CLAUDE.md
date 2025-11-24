# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A context-aware writing assistant that provides real-time suggestions and metrics for different writing modes (technical, creative, business, casual). Built with React, TypeScript, and Vite.

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev    # Start development server (Vite)
```

### Build
```bash
npm run build  # TypeScript check + production build
```

### Preview
```bash
npm run preview  # Preview production build locally
```

### Type Checking
```bash
npm run lint  # Run TypeScript type checker without emitting files
```

## Architecture

### Tech Stack
- **React 19** with TypeScript for UI
- **Vite** for fast development and optimized builds
- **CSS Custom Properties** for theming and design tokens
- Mobile-first responsive design with semantic HTML

### Project Structure
```
src/
├── styles/
│   ├── variables.css   # Design tokens (colors, typography, spacing, etc.)
│   └── global.css      # CSS reset, base styles, accessibility focus states
├── types/
│   └── index.ts        # TypeScript interfaces and types
├── App.tsx             # Main application component
├── App.css             # Application-specific styles
└── main.tsx            # Entry point, imports global styles
```

### Core Types

The application uses comprehensive TypeScript interfaces defined in `src/types/index.ts`:

- **WritingMode**: `'technical' | 'creative' | 'business' | 'casual'`
- **TextAnalysis**: Contains metrics (word count, readability score, tone, etc.)
- **Suggestion**: Writing suggestions with severity, category, range, and alternatives
- **AppState**: Root application state including document, analysis, suggestions, and preferences

### Design System

All design tokens are centralized in `src/styles/variables.css`:
- 4px base spacing scale
- Color palette with semantic naming (primary, secondary, neutral, success, warning, error)
- Typography scale with consistent line heights
- Transition durations for animations
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl), 1536px (2xl)

### Accessibility
- WCAG AA compliant contrast ratios
- Focus-visible states with visible outlines
- Skip-to-main-content link for keyboard navigation
- Semantic HTML with proper ARIA labels
- Screen reader utility classes (.sr-only)
