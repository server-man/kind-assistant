import { useState, useCallback, useRef } from "react";
import { useAI } from "@/contexts/AIContext";
import { useAdmin } from "@/contexts/AdminContext";
import { streamAIResponse } from "@/services/aiService";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isConfigured: boolean;
}

export function useAIChat(): UseAIChatReturn {
  const { config, isConfigured } = useAI();
  const { getCredential, credentials } = useAdmin();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getApiKey = useCallback(() => {
    const credName =
      config.provider === "anthropic"
        ? "Anthropic"
        : config.provider === "openai"
        ? "OpenAI"
        : "Custom";
    return getCredential(credName);
  }, [config.provider, getCredential]);

  const getEndpoint = useCallback(() => {
    if (config.provider !== "custom") return undefined;
    const cred = credentials.find((c) => c.name === "Custom");
    return cred?.endpoint;
  }, [config.provider, credentials]);

  const sendMessage = useCallback(
    async (content: string) => {
      const apiKey = getApiKey();
      if (!apiKey) {
        setError(`Please add your ${config.provider} API key in Admin Settings`);
        return;
      }

      setError(null);
      setIsLoading(true);

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMessage]);

      const assistantMessageId = (Date.now() + 1).toString();
      let assistantContent = "";

      // Add placeholder for streaming
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      try {
        await streamAIResponse(
          messages
            .concat(userMessage)
            .map((m) => ({ role: m.role, content: m.content })),
          {
            config,
            apiKey,
            endpoint: getEndpoint(),
          },
          {
            onToken: (token) => {
              assistantContent += token;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            },
            onComplete: () => {
              setIsLoading(false);
            },
            onError: (err) => {
              setError(err.message);
              setIsLoading(false);
              // Remove empty assistant message on error
              setMessages((prev) =>
                prev.filter(
                  (m) => m.id !== assistantMessageId || m.content.length > 0
                )
              );
            },
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setIsLoading(false);
      }
    },
    [config, messages, getApiKey, getEndpoint]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isConfigured,
  };
}
