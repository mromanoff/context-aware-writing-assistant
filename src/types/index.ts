/**
 * Writing modes for context-aware assistance
 */
export type WritingMode = 'technical' | 'creative' | 'business' | 'casual';

/**
 * Tone analysis result
 */
export type Tone =
  | 'formal'
  | 'informal'
  | 'professional'
  | 'conversational'
  | 'academic'
  | 'persuasive'
  | 'neutral';

/**
 * Suggestion severity levels
 */
export type SuggestionSeverity = 'error' | 'warning' | 'info' | 'suggestion';

/**
 * Suggestion categories
 */
export type SuggestionCategory =
  | 'grammar'
  | 'spelling'
  | 'style'
  | 'clarity'
  | 'conciseness'
  | 'tone'
  | 'structure';

/**
 * Text analysis interface containing metrics and insights
 */
export interface TextAnalysis {
  /** Total number of words in the text */
  wordCount: number;

  /** Total number of characters (including spaces) */
  characterCount: number;

  /** Total number of characters (excluding spaces) */
  characterCountNoSpaces: number;

  /** Number of sentences */
  sentenceCount: number;

  /** Number of paragraphs */
  paragraphCount: number;

  /** Readability score (0-100, higher is easier to read) */
  readabilityScore: number;

  /** Detected tone of the writing */
  tone: Tone;

  /** Average words per sentence */
  avgWordsPerSentence: number;

  /** Average sentence length */
  avgSentenceLength: number;

  /** Estimated reading time in minutes */
  readingTime: number;

  /** Grade level (Flesch-Kincaid) */
  gradeLevel: number;

  /** Timestamp of when analysis was performed */
  analyzedAt: Date;
}

/**
 * Position interface for text location
 */
export interface Position {
  /** Line number (0-indexed) */
  line: number;

  /** Column number (0-indexed) */
  column: number;

  /** Character offset from start of text */
  offset: number;
}

/**
 * Range interface for text span
 */
export interface Range {
  /** Start position */
  start: Position;

  /** End position */
  end: Position;
}

/**
 * Writing suggestion interface
 */
export interface Suggestion {
  /** Unique identifier */
  id: string;

  /** Category of the suggestion */
  category: SuggestionCategory;

  /** Severity level */
  severity: SuggestionSeverity;

  /** Description of the issue or suggestion */
  message: string;

  /** The original text that triggered the suggestion */
  originalText: string;

  /** Suggested replacement text (if applicable) */
  suggestedText?: string;

  /** Alternative suggestions */
  alternatives?: string[];

  /** Location in the text */
  range: Range;

  /** Detailed explanation or reasoning */
  explanation?: string;

  /** Whether this suggestion has been dismissed by user */
  isDismissed: boolean;

  /** Whether this suggestion has been applied */
  isApplied: boolean;

  /** Timestamp of when suggestion was created */
  createdAt: Date;
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  /** Preferred writing mode */
  writingMode: WritingMode;

  /** Whether to enable real-time suggestions */
  enableRealTimeSuggestions: boolean;

  /** Whether to show readability metrics */
  showReadabilityMetrics: boolean;

  /** Whether to enable autocomplete */
  enableAutocomplete: boolean;

  /** Font size preference */
  fontSize: number;

  /** Theme preference */
  theme: 'light' | 'dark' | 'auto';

  /** Categories of suggestions to show */
  enabledSuggestionCategories: SuggestionCategory[];
}

/**
 * Document state interface
 */
export interface DocumentState {
  /** The current text content */
  content: string;

  /** Current cursor position */
  cursorPosition: Position;

  /** Current selection range (if any) */
  selectionRange?: Range;

  /** Whether the document has unsaved changes */
  isDirty: boolean;

  /** Timestamp of last modification */
  lastModified: Date;

  /** Undo history */
  history: string[];

  /** Current position in history */
  historyIndex: number;
}

/**
 * Application state interface
 */
export interface AppState {
  /** Current document state */
  document: DocumentState;

  /** Current text analysis */
  analysis: TextAnalysis | null;

  /** Active suggestions */
  suggestions: Suggestion[];

  /** User preferences */
  preferences: UserPreferences;

  /** Whether analysis is in progress */
  isAnalyzing: boolean;

  /** Whether the app is loading */
  isLoading: boolean;

  /** Error message (if any) */
  error: string | null;

  /** Whether the sidebar is open */
  isSidebarOpen: boolean;
}

/**
 * Initial user preferences
 */
export const defaultUserPreferences: UserPreferences = {
  writingMode: 'casual',
  enableRealTimeSuggestions: true,
  showReadabilityMetrics: true,
  enableAutocomplete: true,
  fontSize: 16,
  theme: 'auto',
  enabledSuggestionCategories: [
    'grammar',
    'spelling',
    'style',
    'clarity',
    'conciseness',
    'tone',
    'structure',
  ],
};

/**
 * Initial document state
 */
export const defaultDocumentState: DocumentState = {
  content: '',
  cursorPosition: { line: 0, column: 0, offset: 0 },
  selectionRange: undefined,
  isDirty: false,
  lastModified: new Date(),
  history: [''],
  historyIndex: 0,
};
