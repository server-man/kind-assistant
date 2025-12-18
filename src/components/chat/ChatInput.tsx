import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-2 bg-elevated rounded-2xl border border-border shadow-soft p-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent px-3 py-2 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 min-h-[44px] max-h-[160px]"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || disabled}
          className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 transition-smooth"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-3">
        Safe AI Assistant • Responses are for informational purposes only
      </p>
    </form>
  );
};
