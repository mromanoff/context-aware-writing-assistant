# OpenAI Service

This service provides integration with OpenAI's GPT-4 API for text analysis and writing suggestions.

## Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Copy `.env.example` to `.env`
3. Add your API key to `.env`:
   ```
   VITE_OPENAI_API_KEY=your_actual_api_key_here
   ```

## Features

### Text Analysis
- Analyzes writing tone and style
- Calculates readability scores
- Identifies key themes and topics
- Provides strengths and improvement areas
- Generates context-aware suggestions

### Writing Suggestions
- Grammar and spelling corrections
- Style improvements
- Clarity enhancements
- Tone adjustments
- Structure recommendations

## Usage

### Using the Hook (Recommended)

```typescript
import { useOpenAI } from '../hooks'

function MyComponent() {
  const { analyze, result, loading, error } = useOpenAI({
    debounceMs: 2000,
    minTextLength: 50,
  })

  const handleAnalyze = async () => {
    await analyze(text, 'technical')
  }

  return (
    // Your component
  )
}
```

### Direct Service Usage

```typescript
import { analyzeText, getSuggestions } from '../services'

// Analyze text
const result = await analyzeText(text, 'technical')

// Get suggestions only
const suggestions = await getSuggestions(text, 'creative')
```

## Configuration

### Model Settings
- Model: `gpt-4-turbo-preview`
- Max Tokens: 2000
- Temperature: 0.7

### Retry Logic
- Max Retries: 3
- Exponential Backoff: 1s, 2s, 4s
- Timeout: 30 seconds

## Error Handling

The service handles:
- Rate limiting (429 errors)
- Network errors
- Timeout errors
- Invalid API keys
- Server errors (5xx)

Errors are returned as `ApiError` objects with:
- `code`: Error code
- `message`: User-friendly message
- `status`: HTTP status code
- `retryable`: Whether the operation can be retried

## Best Practices

### Security
⚠️ **Important**: The current implementation uses the API key in the browser. For production:
1. Move API calls to a backend server
2. Implement proper authentication
3. Rate limit requests per user
4. Monitor API usage

### Performance
- Use the debounced hook for real-time analysis
- Set appropriate `minTextLength` to avoid unnecessary calls
- Cancel requests when component unmounts
- Consider caching results for identical inputs

### Cost Optimization
- Minimize analysis frequency
- Use `getSuggestions` instead of full `analyzeText` when possible
- Set reasonable token limits
- Implement user-based rate limiting

## Writing Modes

### Technical
Focus: Clarity, accuracy, terminology
Ideal for: Documentation, technical articles, specs

### Creative
Focus: Imagery, emotion, narrative flow
Ideal for: Stories, creative writing, blogs

### Business
Focus: Professionalism, conciseness, impact
Ideal for: Emails, reports, proposals

### Casual
Focus: Conversational tone, accessibility
Ideal for: Social media, informal communication
