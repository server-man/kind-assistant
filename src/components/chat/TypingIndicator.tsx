import { Shield } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent flex items-center justify-center">
        <Shield className="w-5 h-5 text-accent-foreground" />
      </div>
      <div className="bg-assistant rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]"></span>
          <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]"></span>
          <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  );
};
