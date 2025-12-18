import { useAdmin } from "@/contexts/AdminContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings, Shield, Server, Globe } from "lucide-react";
import { CredentialsPanel } from "./CredentialsPanel";
import { AIConfigPanel } from "./AIConfigPanel";
import { useLocalhost } from "@/hooks/useLocalhost";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AdminSettingsSheet = () => {
  const { isAdmin, isOwner } = useAdmin();
  const { isLocalhost } = useLocalhost();

  if (!isAdmin) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[480px] p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Admin Settings
          </SheetTitle>
          <SheetDescription>
            Configure your AI assistant, models, and credentials.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="ai" className="flex-1">
          <TabsList className="mx-6 grid w-[calc(100%-48px)] grid-cols-3">
            <TabsTrigger value="ai">AI Model</TabsTrigger>
            <TabsTrigger value="credentials">API Keys</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="px-6 py-4">
              <TabsContent value="ai" className="mt-0 space-y-4">
                <AIConfigPanel />
              </TabsContent>

              <TabsContent value="credentials" className="mt-0 space-y-4">
                <CredentialsPanel />
                
                {/* Quick Add Presets */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Add API keys for AI providers to enable real AI responses.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="status" className="mt-0 space-y-4">
                {/* Access Status */}
                <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Access Status
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Environment</span>
                      <span className="flex items-center gap-1.5">
                        {isLocalhost ? (
                          <>
                            <Globe className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">
                              Localhost
                            </span>
                          </>
                        ) : (
                          <>
                            <Globe className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Production</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Access Level</span>
                      <span
                        className={
                          isOwner
                            ? "text-amber-600 dark:text-amber-400 font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {isOwner ? "Owner" : isAdmin ? "Admin" : "User"}
                      </span>
                    </div>
                  </div>
                  {isLocalhost && (
                    <p className="text-xs text-muted-foreground pt-1 border-t border-border">
                      Full admin access granted via localhost connection.
                    </p>
                  )}
                </div>

                {/* Info Notice */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Credentials are
                    stored locally and only accessible from localhost. For production,
                    connect to Supabase to securely store secrets server-side.
                  </p>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
