import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Plus, Trash2, Eye, EyeOff, Link } from "lucide-react";
import { toast } from "sonner";

export const CredentialsPanel = () => {
  const { isAdmin, credentials, addCredential, removeCredential } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newEndpoint, setNewEndpoint] = useState("");
  const [showKey, setShowKey] = useState(false);

  if (!isAdmin) return null;

  const handleAdd = () => {
    if (!newName.trim() || !newKey.trim()) {
      toast.error("Name and API key are required");
      return;
    }

    addCredential(newName.trim(), newKey.trim(), newEndpoint.trim() || undefined);
    toast.success(`Added ${newName}`);
    setNewName("");
    setNewKey("");
    setNewEndpoint("");
    setIsAdding(false);
  };

  const handleRemove = (name: string) => {
    removeCredential(name);
    toast.success(`Removed ${name}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Key className="w-4 h-4" />
          API Credentials
        </h3>
        {!isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-7 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        )}
      </div>

      {credentials.length === 0 && !isAdding && (
        <p className="text-xs text-muted-foreground py-2">
          No credentials configured. Add API keys for third-party services.
        </p>
      )}

      {credentials.map((cred) => (
        <div
          key={cred.name}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {cred.name}
            </p>
            {cred.endpoint && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <Link className="w-3 h-3 flex-shrink-0" />
                {cred.endpoint}
              </p>
            )}
            <p className="text-xs text-green-600 dark:text-green-400">
              ✓ Key configured
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemove(cred.name)}
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {isAdding && (
        <div className="space-y-3 p-4 rounded-lg border border-border bg-card">
          <div className="space-y-2">
            <Label htmlFor="cred-name" className="text-xs">
              Service Name
            </Label>
            <Input
              id="cred-name"
              placeholder="e.g., OpenAI, Anthropic"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cred-key" className="text-xs">
              API Key
            </Label>
            <div className="relative">
              <Input
                id="cred-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="h-8 text-sm pr-8"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cred-endpoint" className="text-xs">
              Endpoint URL (optional)
            </Label>
            <Input
              id="cred-endpoint"
              placeholder="https://api.example.com/v1"
              value={newEndpoint}
              onChange={(e) => setNewEndpoint(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={handleAdd} className="h-7 text-xs">
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setNewName("");
                setNewKey("");
                setNewEndpoint("");
              }}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
