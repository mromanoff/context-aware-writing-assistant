import type { WritingMode } from '../types'

/**
 * Configuration for a writing mode
 */
export interface ModeConfig {
  /** Mode identifier */
  mode: WritingMode
  /** Display label */
  label: string
  /** Short description */
  description: string
  /** Icon/emoji for visual identification */
  icon: string
  /** Primary color for UI elements */
  color: string
  /** Background color */
  backgroundColor: string
  /** Border color */
  borderColor: string
  /** Example use case */
  example: string
}

/**
 * Configuration for all writing modes
 * Exported as const for type safety
 */
export const MODE_CONFIGS: Record<WritingMode, ModeConfig> = {
  technical: {
    mode: 'technical',
    label: 'Technical',
    description: 'Clear, precise documentation and technical writing',
    icon: '🔧',
    color: '#1e40af', // blue-800
    backgroundColor: '#eff6ff', // blue-50
    borderColor: '#bfdbfe', // blue-200
    example: 'Documentation, specifications, technical articles',
  },
  creative: {
    mode: 'creative',
    label: 'Creative',
    description: 'Imaginative, expressive writing with emotional depth',
    icon: '✨',
    color: '#7e22ce', // purple-700
    backgroundColor: '#faf5ff', // purple-50
    borderColor: '#e9d5ff', // purple-200
    example: 'Stories, poems, creative content',
  },
  business: {
    mode: 'business',
    label: 'Business',
    description: 'Professional, concise business communication',
    icon: '💼',
    color: '#15803d', // green-700
    backgroundColor: '#f0fdf4', // green-50
    borderColor: '#bbf7d0', // green-200
    example: 'Emails, reports, proposals',
  },
  casual: {
    mode: 'casual',
    label: 'Casual',
    description: 'Conversational, approachable everyday writing',
    icon: '💬',
    color: '#c2410c', // orange-700
    backgroundColor: '#fff7ed', // orange-50
    borderColor: '#fed7aa', // orange-200
    example: 'Social media, informal communication',
  },
} as const

/**
 * Get configuration for a specific mode
 */
export function getModeConfig(mode: WritingMode): ModeConfig {
  return MODE_CONFIGS[mode]
}

/**
 * Get all mode configurations as an array
 */
export function getAllModeConfigs(): ModeConfig[] {
  return Object.values(MODE_CONFIGS)
}

/**
 * Get mode label
 */
export function getModeLabel(mode: WritingMode): string {
  return MODE_CONFIGS[mode].label
}

/**
 * Get mode icon
 */
export function getModeIcon(mode: WritingMode): string {
  return MODE_CONFIGS[mode].icon
}

/**
 * Get mode color
 */
export function getModeColor(mode: WritingMode): string {
  return MODE_CONFIGS[mode].color
}
