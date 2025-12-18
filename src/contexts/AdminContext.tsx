import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocalhost } from "@/hooks/useLocalhost";

interface ApiCredentials {
  name: string;
  endpoint?: string;
  hasKey: boolean;
}

interface AdminContextType {
  isAdmin: boolean;
  isOwner: boolean;
  isDeveloper: boolean;
  credentials: ApiCredentials[];
  addCredential: (name: string, key: string, endpoint?: string) => void;
  removeCredential: (name: string) => void;
  getCredential: (name: string) => string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEY = "admin_credentials";

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { isLocalhost } = useLocalhost();
  const [credentials, setCredentials] = useState<ApiCredentials[]>([]);

  // Load credentials from localStorage on mount (only metadata, not actual keys)
  useEffect(() => {
    if (isLocalhost) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCredentials(
            Object.keys(parsed).map((name) => ({
              name,
              endpoint: parsed[name].endpoint,
              hasKey: !!parsed[name].key,
            }))
          );
        } catch {
          // Invalid data, ignore
        }
      }
    }
  }, [isLocalhost]);

  const addCredential = (name: string, key: string, endpoint?: string) => {
    if (!isLocalhost) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : {};
    data[name] = { key, endpoint };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    setCredentials((prev) => {
      const filtered = prev.filter((c) => c.name !== name);
      return [...filtered, { name, endpoint, hasKey: true }];
    });
  };

  const removeCredential = (name: string) => {
    if (!isLocalhost) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      delete data[name];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    setCredentials((prev) => prev.filter((c) => c.name !== name));
  };

  const getCredential = (name: string): string | null => {
    if (!isLocalhost) return null;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data[name]?.key || null;
    }
    return null;
  };

  // Localhost users get full admin/owner/developer access
  const isAdmin = isLocalhost;
  const isOwner = isLocalhost;
  const isDeveloper = isLocalhost;

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isOwner,
        isDeveloper,
        credentials,
        addCredential,
        removeCredential,
        getCredential,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};
