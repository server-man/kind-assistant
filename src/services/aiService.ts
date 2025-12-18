import { AIConfig } from "@/types/ai";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIServiceOptions {
  config: AIConfig;
  apiKey: string;
  endpoint?: string;
}

interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

// Anthropic API call
async function callAnthropic(
  messages: ChatMessage[],
  options: AIServiceOptions,
  callbacks: StreamCallbacks
): Promise<void> {
  const { config, apiKey } = options;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        system: config.systemPrompt,
        messages: messages.filter((m) => m.role !== "system"),
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              const token = parsed.delta.text;
              fullResponse += token;
              callbacks.onToken(token);
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    callbacks.onComplete(fullResponse);
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}

// OpenAI API call
async function callOpenAI(
  messages: ChatMessage[],
  options: AIServiceOptions,
  callbacks: StreamCallbacks
): Promise<void> {
  const { config, apiKey } = options;

  const formattedMessages = [
    { role: "system" as const, content: config.systemPrompt },
    ...messages.filter((m) => m.role !== "system"),
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: formattedMessages,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) {
              fullResponse += token;
              callbacks.onToken(token);
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    callbacks.onComplete(fullResponse);
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}

// Custom endpoint call
async function callCustom(
  messages: ChatMessage[],
  options: AIServiceOptions,
  callbacks: StreamCallbacks
): Promise<void> {
  const { config, apiKey, endpoint } = options;

  if (!endpoint) {
    callbacks.onError(new Error("Custom endpoint URL required"));
    return;
  }

  const formattedMessages = [
    { role: "system" as const, content: config.systemPrompt },
    ...messages.filter((m) => m.role !== "system"),
  ];

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: formattedMessages,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const token =
              parsed.choices?.[0]?.delta?.content || parsed.delta?.text;
            if (token) {
              fullResponse += token;
              callbacks.onToken(token);
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    callbacks.onComplete(fullResponse);
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}

// Main service function
export async function streamAIResponse(
  messages: ChatMessage[],
  options: AIServiceOptions,
  callbacks: StreamCallbacks
): Promise<void> {
  const { config } = options;

  switch (config.provider) {
    case "anthropic":
      return callAnthropic(messages, options, callbacks);
    case "openai":
      return callOpenAI(messages, options, callbacks);
    case "custom":
      return callCustom(messages, options, callbacks);
    default:
      callbacks.onError(new Error(`Unknown provider: ${config.provider}`));
  }
}

// Non-streaming version for simpler use cases
export async function getAIResponse(
  messages: ChatMessage[],
  options: AIServiceOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    let response = "";
    streamAIResponse(messages, options, {
      onToken: (token) => {
        response += token;
      },
      onComplete: () => resolve(response),
      onError: reject,
    });
  });
}
