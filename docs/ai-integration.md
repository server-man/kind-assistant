# AI Integration

## Overview

The platform supports multiple LLM providers with streaming responses, configurable system prompts, and real-time parameter tuning.

## Supported Providers

### Anthropic (Claude)

| Model | Description |
|-------|-------------|
| `claude-sonnet-4-5` | Most capable, superior reasoning |
| `claude-opus-4-1-20250805` | Highly intelligent, more expensive |
| `claude-3-5-haiku-20241022` | Fastest for quick responses |

**API Endpoint**: `https://api.anthropic.com/v1/messages`

### OpenAI (GPT)

| Model | Description |
|-------|-------------|
| `gpt-4o` | Most capable GPT model |
| `gpt-4o-mini` | Fast and affordable |
| `gpt-4-turbo` | High capability with vision |
| `gpt-3.5-turbo` | Fast, good for simple tasks |

**API Endpoint**: `https://api.openai.com/v1/chat/completions`

### Custom Endpoints

Any OpenAI-compatible API can be used:

- Local LLMs (Ollama, LM Studio)
- Self-hosted models
- Alternative providers (Together, Groq, etc.)

## Configuration

### Setting Up a Provider

1. Open Admin Settings (localhost only)
2. Go to "AI Model" tab
3. Select provider
4. Add API key in "API Keys" tab
5. Configure model and parameters

### AIContext Configuration

```typescript
interface AIConfig {
  provider: 'anthropic' | 'openai' | 'custom';
  model: string;
  systemPrompt: string;
  temperature: number;
  customEndpoint?: string;
}
```

## Usage

### Using the Chat Hook

```typescript
import { useAIChat } from "@/hooks/useAIChat";

const MyComponent = () => {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error 
  } = useAIChat();

  const handleSend = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
};
```

### Direct Service Usage

```typescript
import { sendMessage } from "@/services/aiService";

const response = await sendMessage({
  messages: [{ role: 'user', content: 'Hello!' }],
  config: {
    provider: 'anthropic',
    model: 'claude-sonnet-4-5',
    systemPrompt: 'You are a helpful assistant.',
    temperature: 0.7
  },
  apiKey: 'your-api-key',
  onChunk: (chunk) => {
    console.log('Received:', chunk);
  }
});
```

## Streaming Implementation

### How It Works

1. Request sent to provider API with `stream: true`
2. Response arrives as Server-Sent Events (SSE)
3. Each chunk is parsed and passed to `onChunk` callback
4. UI updates in real-time as chunks arrive

### Provider-Specific Parsing

**Anthropic Format**:
```json
{"type": "content_block_delta", "delta": {"text": "Hello"}}
```

**OpenAI Format**:
```json
{"choices": [{"delta": {"content": "Hello"}}]}
```

## System Prompts

### Default Prompt

```
You are a helpful AI assistant. Be concise and helpful.
```

### Customization

Admins can set custom system prompts via the AI Config panel:

- Define persona and behavior
- Set response format guidelines
- Include domain-specific instructions
- Add safety guidelines

### Best Practices

1. **Be specific**: Clear instructions produce better results
2. **Set constraints**: Define what the AI should/shouldn't do
3. **Include examples**: Show desired response format
4. **Keep it focused**: Avoid conflicting instructions

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid API key | Check/update API key |
| 429 Rate Limited | Too many requests | Wait and retry |
| 500 Server Error | Provider issue | Retry or switch provider |
| Network Error | Connection failed | Check internet connection |

### Fallback Behavior

When no valid configuration exists, the system returns demo responses:

```typescript
if (!isConfigured) {
  return {
    content: "This is a demo response...",
    role: "assistant"
  };
}
```

## Adding New Providers

### 1. Update Types

```typescript
// src/types/ai.ts
export type AIProviderType = 'anthropic' | 'openai' | 'custom' | 'newprovider';
```

### 2. Add to Provider Config

```typescript
// src/contexts/AIContext.tsx
export const AI_PROVIDERS: AIProvider[] = [
  // ... existing providers
  {
    id: 'newprovider',
    name: 'New Provider',
    models: ['model-1', 'model-2'],
    requiresEndpoint: false,
    credentialKey: 'newprovider'
  }
];
```

### 3. Update Service

```typescript
// src/services/aiService.ts
// Add API formatting and response parsing for new provider
```

## Performance Considerations

1. **Streaming**: Always prefer streaming for better UX
2. **Token Limits**: Monitor usage to avoid hitting limits
3. **Caching**: Consider caching for repeated queries
4. **Timeouts**: Implement reasonable timeout handling
