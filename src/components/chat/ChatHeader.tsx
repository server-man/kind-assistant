import { Shield } from "lucide-react";

export const ChatHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-elevated/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
          <Shield className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Safe Assistant</h1>
          <p className="text-xs text-muted-foreground">Helpful, safe & predictable</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle"></span>
          Online
        </span>
      </div>
    </header>
  );
};
