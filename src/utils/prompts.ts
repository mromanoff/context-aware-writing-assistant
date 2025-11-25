import type { WritingMode } from '../types'

/**
 * System prompts for different writing modes
 */
export const SYSTEM_PROMPTS: Record<WritingMode, string> = {
  technical: `You are an expert technical writing assistant. Analyze the text with focus on:
- Clarity and precision of technical concepts
- Appropriate use of technical terminology and jargon
- Logical structure and organization
- Accuracy of information
- Conciseness while maintaining completeness
- Use of active voice where appropriate
- Clear explanations of complex concepts

Provide suggestions that improve technical accuracy, clarity, and professionalism.`,

  creative: `You are a creative writing coach. Analyze the text with focus on:
- Vivid imagery and sensory details
- Emotional resonance and impact
- Flow and rhythm of language
- Character development and dialogue (if applicable)
- Originality and creative expression
- Show vs. tell balance
- Engaging narrative voice

Provide suggestions that enhance creativity, emotional depth, and reader engagement.`,

  business: `You are a business communications expert. Analyze the text with focus on:
- Professional tone and formality
- Conciseness and clarity
- Action-oriented language
- Appropriate business terminology
- Clear call-to-action where relevant
- Audience awareness
- Persuasiveness and impact
- Proper email/document structure

Provide suggestions that improve professionalism, clarity, and business effectiveness.`,

  casual: `You are a conversational writing coach. Analyze the text with focus on:
- Natural, conversational tone
- Readability and accessibility
- Friendly and approachable language
- Appropriate use of contractions
- Clear and simple explanations
- Relatable examples
- Engaging style
- Avoiding overly formal language

Provide suggestions that make the writing more approachable, engaging, and easy to read.`,
}

/**
 * Generate analysis prompt for text that requests comprehensive analysis from OpenAI
 *
 * @param text - The text to analyze
 * @param mode - Writing mode context that determines the focus of analysis
 * @returns Formatted prompt string for OpenAI API requesting detailed analysis in JSON format
 */
export function getAnalysisPrompt(text: string, mode: WritingMode): string {
  return `Analyze the following ${mode} writing and provide a detailed assessment.

Text to analyze:
"""
${text}
"""

Please provide your analysis in the following JSON format:
{
  "tone": "formal|informal|professional|conversational|academic|persuasive|neutral",
  "readabilityScore": <number between 0-100>,
  "gradeLevel": <number>,
  "sentiment": "positive|neutral|negative",
  "strengths": [<array of key strengths>],
  "improvements": [<array of areas to improve>],
  "themes": [<array of main themes or topics>],
  "suggestions": [
    {
      "category": "grammar|spelling|style|clarity|conciseness|tone|structure",
      "severity": "error|warning|info|suggestion",
      "message": "<clear description>",
      "originalText": "<text that needs improvement>",
      "suggestedText": "<improved version>",
      "alternatives": [<array of alternative suggestions>],
      "explanation": "<why this improvement helps>"
    }
  ]
}

Provide 3-5 most impactful suggestions. Be specific and actionable.`
}

/**
 * Generate suggestions prompt that requests specific writing improvements from OpenAI
 *
 * @param text - The text to get suggestions for
 * @param mode - Writing mode context that determines the type of suggestions
 * @returns Formatted prompt string for OpenAI API requesting 3-5 actionable suggestions in JSON format
 */
export function getSuggestionsPrompt(text: string, mode: WritingMode): string {
  return `As a ${mode} writing expert, provide specific writing suggestions for the following text.

Text:
"""
${text}
"""

Focus on the most impactful improvements for ${mode} writing. Provide 3-5 concrete, actionable suggestions in JSON format:
[
  {
    "category": "grammar|spelling|style|clarity|conciseness|tone|structure",
    "severity": "error|warning|info|suggestion",
    "message": "<specific issue>",
    "originalText": "<exact text to change>",
    "suggestedText": "<your suggestion>",
    "alternatives": [<2-3 alternatives if applicable>],
    "explanation": "<brief why this helps>"
  }
]

Be specific about what to change and why. Focus on ${mode}-appropriate improvements.`
}

/**
 * Generate improvement prompt that requests an improved version of text from OpenAI
 *
 * @param text - The text to improve
 * @param mode - Writing mode context that guides the improvement style
 * @param focus - Optional specific area to focus on (e.g., "clarity", "conciseness")
 * @returns Formatted prompt string for OpenAI API requesting improved text with explanation in JSON format
 */
export function getImprovementPrompt(
  text: string,
  mode: WritingMode,
  focus?: string
): string {
  const focusText = focus ? `\n\nSpecific focus: ${focus}` : ''

  return `Improve the following ${mode} writing. Make it better while preserving the core message and intent.${focusText}

Original text:
"""
${text}
"""

Provide:
1. Improved version of the text
2. Brief explanation of key changes made
3. Why these changes improve the writing for ${mode} context

Response in JSON format:
{
  "improved": "<improved text>",
  "changes": [<array of key changes made>],
  "explanation": "<why these changes help>"
}`
}

/**
 * Rate limit error message
 */
export const RATE_LIMIT_ERROR_MESSAGE =
  'API rate limit exceeded. Please wait a moment and try again.'

/**
 * Network error message
 */
export const NETWORK_ERROR_MESSAGE =
  'Network error. Please check your connection and try again.'

/**
 * Generic API error message
 */
export const API_ERROR_MESSAGE =
  'An error occurred while analyzing your text. Please try again.'

/**
 * Missing API key error message
 */
export const MISSING_API_KEY_MESSAGE =
  'OpenAI API key is not configured. Please add your API key to continue.'
