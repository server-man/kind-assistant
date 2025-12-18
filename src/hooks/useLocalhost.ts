import { useMemo } from "react";

export const useLocalhost = () => {
  const isLocalhost = useMemo(() => {
    const hostname = window.location.hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.")
    );
  }, []);

  return { isLocalhost };
};
