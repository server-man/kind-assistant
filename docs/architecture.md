# Architecture Overview

## Design Philosophy

This project follows a **frontend-first architecture** using Vite, React, and TypeScript. It operates without a backend dependency, with admin and credential management features running locally on localhost.

## Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Application                       │
├─────────────────────────────────────────────────────────────┤
│  Contexts                                                    │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  AdminContext   │  │   AIContext     │                   │
│  │  - isAdmin      │  │  - provider     │                   │
│  │  - credentials  │  │  - model        │                   │
│  │  - ownership    │  │  - systemPrompt │                   │
│  └─────────────────┘  └─────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│  Services                                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  AIService - Streaming API calls to LLM providers       ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Storage Layer                                               │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  localStorage   │  │  Memory State   │                   │
│  │  - API keys     │  │  - Credentials  │                   │
│  │  - AI config    │  │    metadata     │                   │
│  └─────────────────┘  └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Admin Authentication Flow

```
User Request → useLocalhost Hook → Check hostname
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
              localhost:*                            Remote Host
                    │                                       │
                    ▼                                       ▼
           Grant Admin Access                    Deny Admin Access
           (isAdmin = true)                      (isAdmin = false)
```

### AI Chat Flow

```
User Message → useAIChat Hook → Check AI Config
                                      │
                  ┌───────────────────┴───────────────────┐
                  ▼                                       ▼
           Config Valid                           No Config
                  │                                       │
                  ▼                                       ▼
         AIService.sendMessage()                 Demo Response
                  │
                  ▼
         Stream Response Chunks
                  │
                  ▼
         Update UI in Real-time
```

## Key Components

### AdminContext

Manages admin state and credential storage:

- **isAdmin**: Derived from localhost detection
- **credentials**: Metadata about stored API keys
- **addCredential/removeCredential**: CRUD operations for credentials
- **getCredential**: Retrieve actual API key values

### AIContext

Manages AI provider configuration:

- **provider**: Selected LLM provider (anthropic, openai, custom)
- **model**: Specific model identifier
- **systemPrompt**: Custom instructions for the AI
- **temperature**: Response randomness (0-1)

### AIService

Handles communication with LLM providers:

- Streaming SSE responses
- Provider-specific API formatting
- Error handling and fallbacks

## Storage Strategy

| Data Type | Storage Location | Reason |
|-----------|------------------|--------|
| API Keys | localStorage | Persist across sessions, localhost-only access |
| AI Config | localStorage | User preferences should persist |
| Credential Metadata | Memory (State) | Quick access, derived from localStorage |
| Chat Messages | Memory (State) | Ephemeral, no persistence needed |

## Extensibility Points

1. **New LLM Providers**: Add to `AIProviderType` in `types/ai.ts`
2. **Custom Endpoints**: Use the "custom" provider with any OpenAI-compatible API
3. **Admin Features**: Extend `AdminSettingsSheet` with new tabs
4. **Chat Features**: Modify `useAIChat` hook for additional functionality
