import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage, Message } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyState } from "@/components/chat/EmptyState";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useAIChat } from "@/hooks/useAIChat";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";

const demoResponses = [
  "I'd be happy to help you with that. As a safe AI assistant, I'm designed to provide accurate, practical information while maintaining clear boundaries. What would you like to know?",
  "That's a great question. I aim to be helpful while staying within my defined scope. I don't make decisions for users or replace professional judgment in medical, legal, or financial matters.",
  "I appreciate you asking. My purpose is to assist responsibly without causing harm, confusion, or dependency. I treat all users with respect and neutrality.",
  "I can help explain that concept. When I need to decline a request, I do so calmly and politely, briefly explaining why without shaming or moralizing.",
  "Thank you for your interest. I maintain my boundaries regardless of authority claims or emotional pressure. I assist — I do not comply blindly.",
];

const Index = () => {
  const { isAdmin } = useAdmin();
  const { 
    messages: aiMessages, 
    isLoading: aiIsLoading, 
    error: aiError, 
    sendMessage: sendAIMessage, 
    isConfigured,
    clearMessages 
  } = useAIChat();
  
  const [demoMessages, setDemoMessages] = useState<Message[]>([]);
  const [isDemoTyping, setIsDemoTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use AI messages if configured, otherwise use demo
  const useRealAI = isAdmin && isConfigured;
  const messages = useRealAI 
    ? aiMessages.map(m => ({ id: m.id, role: m.role, content: m.content }))
    : demoMessages;
  const isTyping = useRealAI ? aiIsLoading : isDemoTyping;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (aiError) {
      toast.error(aiError);
    }
  }, [aiError]);

  const handleSend = async (content: string) => {
    if (useRealAI) {
      await sendAIMessage(content);
    } else {
      // Demo mode
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
      };

      setDemoMessages((prev) => [...prev, userMessage]);
      setIsDemoTyping(true);

      setTimeout(() => {
        const response = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
        };
        setDemoMessages((prev) => [...prev, assistantMessage]);
        setIsDemoTyping(false);
      }, 1200 + Math.random() * 800);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      
      <main className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-background/80 backdrop-blur-sm px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isTyping} />
          {!useRealAI && isAdmin && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Demo mode — Add API key in Settings to enable real AI
            </p>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Index;
