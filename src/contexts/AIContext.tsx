import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AIConfig, AIProvider as AIProviderType, DEFAULT_AI_CONFIG } from "@/types/ai";
import { useAdmin } from "./AdminContext";

interface AIContextType {
  config: AIConfig;
  updateConfig: (updates: Partial<AIConfig>) => void;
  resetConfig: () => void;
  isConfigured: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const AI_CONFIG_KEY = "ai_config";

export const AIContextProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin, getCredential } = useAdmin();
  const [config, setConfig] = useState<AIConfig>(DEFAULT_AI_CONFIG);

  // Load config from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AI_CONFIG_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfig({ ...DEFAULT_AI_CONFIG, ...parsed });
      } catch {
        // Invalid data, use defaults
      }
    }
  }, []);

  const updateConfig = (updates: Partial<AIConfig>) => {
    if (!isAdmin) return;
    
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(newConfig));
  };

  const resetConfig = () => {
    if (!isAdmin) return;
    
    setConfig(DEFAULT_AI_CONFIG);
    localStorage.removeItem(AI_CONFIG_KEY);
  };

  // Check if the current provider has credentials configured
  const getCredentialKey = (provider: AIProviderType): string => {
    switch (provider) {
      case "anthropic":
        return "Anthropic";
      case "openai":
        return "OpenAI";
      case "custom":
        return "Custom";
      default:
        return "";
    }
  };

  const isConfigured = !!getCredential(getCredentialKey(config.provider));

  return (
    <AIContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        isConfigured,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export { AIContext };

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within AIProvider");
  }
  return context;
};
