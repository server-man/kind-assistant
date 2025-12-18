# Development Guide

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or bun package manager
- A code editor (VS Code recommended)

### Installation

```bash
# Clone or download the project
cd ai-assistant-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── admin/              # Admin-only components
│   │   ├── AdminBadge.tsx
│   │   ├── AdminSettingsSheet.tsx
│   │   ├── AIConfigPanel.tsx
│   │   └── CredentialsPanel.tsx
│   ├── chat/               # Chat interface
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── EmptyState.tsx
│   │   └── TypingIndicator.tsx
│   └── ui/                 # Shadcn UI components
├── contexts/
│   ├── AdminContext.tsx    # Admin state management
│   └── AIContext.tsx       # AI configuration state
├── hooks/
│   ├── useAIChat.ts        # Chat functionality hook
│   ├── useLocalhost.ts     # Localhost detection
│   └── use-mobile.tsx      # Mobile detection
├── services/
│   └── aiService.ts        # LLM API integration
├── types/
│   └── ai.ts               # TypeScript definitions
└── pages/
    ├── Index.tsx           # Main chat page
    └── NotFound.tsx        # 404 page
```

## Core Concepts

### Context Providers

The app uses two main context providers:

```tsx
// App.tsx
<AdminProvider>
  <AIContextProvider>
    <App />
  </AIContextProvider>
</AdminProvider>
```

**AdminProvider**: Manages localhost detection and credentials
**AIContextProvider**: Manages AI configuration and provider settings

### Hooks

#### useLocalhost

```typescript
const { isLocalhost } = useLocalhost();
// Returns true if running on localhost/127.0.0.1
```

#### useAdmin

```typescript
const { 
  isAdmin,           // Boolean - has admin access
  credentials,       // Array - stored credential metadata
  addCredential,     // Function - add new credential
  removeCredential,  // Function - remove credential
  getCredential      // Function - get actual key value
} = useAdmin();
```

#### useAI

```typescript
const {
  config,            // Current AI configuration
  setProvider,       // Change LLM provider
  setModel,          // Change model
  setSystemPrompt,   // Change system prompt
  setTemperature,    // Change temperature
  isConfigured       // Boolean - has valid config
} = useAI();
```

#### useAIChat

```typescript
const {
  messages,          // Chat message array
  sendMessage,       // Send new message
  isLoading,         // Boolean - waiting for response
  error              // Error message if any
} = useAIChat();
```

## Adding Features

### New Admin Feature

1. Create component in `src/components/admin/`:

```tsx
// src/components/admin/MyFeature.tsx
import { useAdmin } from "@/contexts/AdminContext";

export const MyFeature = () => {
  const { isAdmin } = useAdmin();
  
  if (!isAdmin) return null;
  
  return (
    <div className="p-4">
      <h3>My Admin Feature</h3>
      {/* Feature content */}
    </div>
  );
};
```

2. Add to AdminSettingsSheet if it's a settings feature.

### New AI Provider

1. Update types:

```typescript
// src/types/ai.ts
export type AIProviderType = 'anthropic' | 'openai' | 'custom' | 'myprovider';
```

2. Add provider config:

```typescript
// src/contexts/AIContext.tsx
export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    models: [
      "claude-sonnet-4-5",
      "claude-opus-4-1-20250805",
      "claude-3-5-haiku-20241022",
    ],
    requiresEndpoint: false,
    credentialKey: "anthropic",
  },
  {
    id: "openai",
    name: "OpenAI (GPT)",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    requiresEndpoint: false,
    credentialKey: "openai",
  },
  {
    id: "custom",
    name: "Custom Endpoint",
    models: [],
    requiresEndpoint: true,
    credentialKey: "custom",
  },
  {
    id: 'myprovider',
    name: 'My Provider',
    models: ['model-a', 'model-b'],
    requiresEndpoint: false,
    credentialKey: 'myprovider'
  }
];
```

3. Update service for API format differences.

### New Chat Feature

Extend the `useAIChat` hook:

```typescript
// src/hooks/useAIChat.ts
export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { config, isConfigured } = useAI();
  const { getCredential } = useAdmin();
  
  const myNewFeature = useCallback(() => {
    // Implementation
  }, []);
  
  return {
    messages,
    sendMessage,
    isLoading,
    error,
    myNewFeature
  };
};
```

## Styling

### Design System

Use Tailwind with semantic tokens from `index.css`:

```tsx
// ✅ Good - uses design system
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>

// ❌ Bad - hardcoded colors
<div className="bg-white text-black">
  <button className="bg-blue-500 text-white">
    Click me
  </button>
</div>
```

### Available Tokens

| Token | Usage |
|-------|-------|
| `background` | Page/card backgrounds |
| `foreground` | Primary text |
| `primary` | Brand/action color |
| `secondary` | Secondary elements |
| `muted` | Subdued backgrounds |
| `accent` | Highlights |
| `destructive` | Error/danger states |

### Dark Mode

The app supports dark mode via `next-themes`. Tokens automatically switch.

## Testing

### Manual Testing

1. Run on localhost for admin features
2. Test without credentials for demo mode
3. Add credentials and test real AI responses
4. Test streaming behavior

### Key Test Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| No localhost | Admin features hidden |
| Localhost, no creds | Demo responses |
| Localhost + creds | Real AI responses |
| Invalid API key | Error toast shown |
| Network failure | Graceful error handling |

## Debugging

### Console Logs

Key areas log helpful information:

```typescript
// AIService logs
console.log('Sending to provider:', provider);
console.log('Stream chunk:', chunk);

// AdminContext logs  
console.log('Localhost detected:', isLocal);
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Admin not showing | Check localhost detection |
| API calls failing | Check credentials, CORS |
| Streaming not working | Check SSE parsing |
| Config not saving | Check localStorage |

## Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Lovable Deployment

1. Click "Publish" in Lovable
2. Frontend deploys automatically
3. For backend features, enable Cloud

## Best Practices

1. **Keep components small**: Split large components
2. **Use the design system**: Never hardcode colors
3. **Type everything**: Full TypeScript coverage
4. **Handle errors gracefully**: Show user-friendly messages
5. **Test on localhost**: Admin features need local testing
6. **Document changes**: Update docs when adding features
