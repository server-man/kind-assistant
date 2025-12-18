import { Shield, Crown, Code } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

export const AdminBadge = () => {
  const { isOwner, isAdmin, isDeveloper } = useAdmin();

  if (!isOwner && !isAdmin && !isDeveloper) return null;

  return (
    <div className="flex items-center gap-2">
      {isOwner && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          <Crown className="w-3 h-3" />
          Owner
        </span>
      )}
      {isAdmin && !isOwner && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
          <Shield className="w-3 h-3" />
          Admin
        </span>
      )}
      {isDeveloper && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30">
          <Code className="w-3 h-3" />
          Dev
        </span>
      )}
    </div>
  );
};
