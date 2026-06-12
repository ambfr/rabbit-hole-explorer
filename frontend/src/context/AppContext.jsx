import { createContext, useCallback, useContext, useState } from "react";
import { expandTopic } from "../api/client";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTopic = useCallback(async (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setTopic(trimmed);
    setLoading(true);
    setError(null);

    try {
      const data = await expandTopic(trimmed);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.message || "Failed to expand topic");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{ topic, result, loading, error, searchTopic }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
