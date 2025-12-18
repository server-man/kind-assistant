# AI Assistant Platform Documentation

Welcome to the AI Assistant Platform documentation. This guide covers the architecture, features, and development guidelines for the project.

## Table of Contents

1. [Architecture Overview](./architecture.md)
2. [Admin System](./admin-system.md)
3. [AI Integration](./ai-integration.md)
4. [MCP Connections](./mcp-connections.md)
5. [Security Guidelines](./security.md)
6. [Development Guide](./development-guide.md)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or bun package manager

### Running Locally

```bash
npm install
npm run dev
```

**Important**: Admin features are only accessible when running on `localhost`. This is the primary mechanism for confirming ownership.

## Key Features

- **Multi-LLM Support**: Connect to Anthropic Claude, OpenAI GPT, or custom endpoints
- **Localhost-Based Admin**: Secure admin access without backend authentication
- **Streaming Responses**: Real-time AI response streaming
- **Configurable System Prompts**: Customize AI behavior per deployment
- **Credential Management**: Secure local storage of API keys

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin-only components
│   ├── chat/           # Chat interface components
│   └── ui/             # Shadcn UI components
├── contexts/           # React contexts (Admin, AI)
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── pages/              # Route pages
```
