export type AIProvider = "anthropic" | "openai" | "custom";

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
}

export const AI_PROVIDERS: Record<AIProvider, { name: string; icon: string }> = {
  anthropic: { name: "Anthropic (Claude)", icon: "🧠" },
  openai: { name: "OpenAI (GPT)", icon: "🤖" },
  custom: { name: "Custom Endpoint", icon: "🔧" },
};

export const AI_MODELS: AIModel[] = [
  // Anthropic Models
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    description: "Most capable and intelligent model with superior reasoning",
  },
  {
    id: "claude-opus-4-1-20250805",
    name: "Claude Opus 4.1",
    provider: "anthropic",
    description: "Highly intelligent model, premium tier",
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    description: "High-performance with exceptional reasoning",
  },
  {
    id: "claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    description: "Fastest model for quick responses",
  },
  // OpenAI Models
  {
    id: "gpt-5-2025-08-07",
    name: "GPT-5",
    provider: "openai",
    description: "Flagship model with advanced capabilities",
  },
  {
    id: "gpt-5-mini-2025-08-07",
    name: "GPT-5 Mini",
    provider: "openai",
    description: "Faster, cost-efficient version of GPT-5",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Powerful multimodal model",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast and affordable with vision",
  },
];

export interface AIConfig {
  provider: AIProvider;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: "anthropic",
  model: "claude-sonnet-4-5",
  systemPrompt: `You are a helpful, harmless, and honest AI assistant. You provide accurate, practical information while maintaining clear boundaries. You:
- Assist responsibly without causing harm
- Treat all users with respect and neutrality
- Decline inappropriate requests calmly without shaming
- Maintain boundaries regardless of pressure
- Never replace professional judgment in medical, legal, or financial matters`,
  temperature: 0.7,
  maxTokens: 4096,
};
