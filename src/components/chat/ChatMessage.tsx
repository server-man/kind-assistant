import { cn } from "@/lib/utils";
import { Shield, User } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-4 animate-fade-in",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent flex items-center justify-center">
          <Shield className="w-5 h-5 text-accent-foreground" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
          isAssistant
            ? "bg-assistant text-foreground rounded-tl-md"
            : "bg-primary text-primary-foreground rounded-tr-md"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      {!isAssistant && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};
