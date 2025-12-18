import { useAI } from "@/contexts/AIContext";
import { useAdmin } from "@/contexts/AdminContext";
import { AI_MODELS, AI_PROVIDERS, AIProvider as AIProviderType } from "@/types/ai";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, RotateCcw, Sparkles, Thermometer, Hash } from "lucide-react";
import { toast } from "sonner";

export const AIConfigPanel = () => {
  const { isAdmin, getCredential } = useAdmin();
  const { config, updateConfig, resetConfig, isConfigured } = useAI();

  if (!isAdmin) return null;

  const availableModels = AI_MODELS.filter((m) => m.provider === config.provider);
  const currentProvider = AI_PROVIDERS[config.provider];

  const handleProviderChange = (provider: AIProviderType) => {
    const firstModel = AI_MODELS.find((m) => m.provider === provider);
    updateConfig({
      provider,
      model: firstModel?.id || "",
    });
  };

  const handleReset = () => {
    resetConfig();
    toast.success("AI configuration reset to defaults");
  };

  const getCredentialStatus = () => {
    const credName =
      config.provider === "anthropic"
        ? "Anthropic"
        : config.provider === "openai"
        ? "OpenAI"
        : "Custom";
    return !!getCredential(credName);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI Model Configuration
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-7 text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Provider Status */}
      <div
        className={`p-3 rounded-lg border ${
          getCredentialStatus()
            ? "bg-green-500/10 border-green-500/30"
            : "bg-amber-500/10 border-amber-500/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <Sparkles
            className={`w-4 h-4 ${
              getCredentialStatus() ? "text-green-500" : "text-amber-500"
            }`}
          />
          <span className="text-sm">
            {getCredentialStatus() ? (
              <span className="text-green-600 dark:text-green-400">
                {currentProvider.name} API configured
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">
                Add {currentProvider.name} API key in Credentials
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="space-y-2">
        <Label className="text-xs">Provider</Label>
        <Select
          value={config.provider}
          onValueChange={(v) => handleProviderChange(v as AIProviderType)}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(AI_PROVIDERS).map(([key, { name, icon }]) => (
              <SelectItem key={key} value={key}>
                <span className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span>{name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label className="text-xs">Model</Label>
        <Select
          value={config.model}
          onValueChange={(v) => updateConfig({ model: v })}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex flex-col">
                  <span>{model.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {model.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Temperature */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            Temperature
          </Label>
          <span className="text-xs text-muted-foreground">
            {config.temperature.toFixed(1)}
          </span>
        </div>
        <Slider
          value={[config.temperature]}
          onValueChange={([v]) => updateConfig({ temperature: v })}
          min={0}
          max={2}
          step={0.1}
          className="py-2"
        />
        <p className="text-xs text-muted-foreground">
          Lower = focused, Higher = creative
        </p>
      </div>

      {/* Max Tokens */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center gap-1">
            <Hash className="w-3 h-3" />
            Max Tokens
          </Label>
          <span className="text-xs text-muted-foreground">{config.maxTokens}</span>
        </div>
        <Slider
          value={[config.maxTokens]}
          onValueChange={([v]) => updateConfig({ maxTokens: v })}
          min={256}
          max={8192}
          step={256}
          className="py-2"
        />
      </div>

      {/* System Prompt */}
      <div className="space-y-2">
        <Label className="text-xs">System Prompt</Label>
        <Textarea
          value={config.systemPrompt}
          onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
          placeholder="Instructions for how the AI should behave..."
          className="min-h-[120px] text-sm resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Define the AI's personality, capabilities, and boundaries.
        </p>
      </div>
    </div>
  );
};
