import { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { expandTopic } from "../api/client";
import { mergeExpansion, toId } from "../utils/graph";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const expandNode = useCallback(async (query, { isRoot = false } = {}) => {
    const trimmed = query.trim();
    if (!trimmed) return null;

    setLoading(true);
    setError(null);
    setTopic(trimmed);

    try {
      const data = await expandTopic(trimmed);
      setGraph((prev) => mergeExpansion(prev, trimmed, data, { isRoot }));
      return data;
    } catch (err) {
      setError(err.message || "Failed to expand topic");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const startExploring = useCallback(
    async (query) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      setGraph({ nodes: [], edges: [] });
      setSelectedNodeId(null);
      setSelectedDetail(null);
      setPanelOpen(false);
      setError(null);
      navigate("/explore");

      setPanelOpen(true);
      setSelectedDetail({
        label: trimmed,
        summary: null,
        relatedTopics: [],
        loading: true,
      });

      const data = await expandNode(trimmed, { isRoot: true });
      if (data) {
        setSelectedNodeId(toId(trimmed));
        setSelectedDetail({
          label: trimmed,
          summary: data.summary,
          relatedTopics: data.related_topics,
          loading: false,
        });
      } else {
        setPanelOpen(false);
        setSelectedDetail(null);
      }
    },
    [expandNode, navigate],
  );

  const selectAndExpand = useCallback(
    async (nodeId, label) => {
      setSelectedNodeId(nodeId);
      setPanelOpen(true);
      setSelectedDetail({
        label,
        summary: null,
        relatedTopics: [],
        loading: true,
      });

      const data = await expandNode(label);
      if (data) {
        setSelectedDetail({
          label,
          summary: data.summary,
          relatedTopics: data.related_topics,
          loading: false,
        });
      } else {
        setSelectedDetail((prev) =>
          prev ? { ...prev, loading: false } : null,
        );
      }
    },
    [expandNode],
  );

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setSelectedNodeId(null);
    setSelectedDetail(null);
  }, []);

  const resetExploration = useCallback(() => {
    setTopic("");
    setGraph({ nodes: [], edges: [] });
    setSelectedNodeId(null);
    setSelectedDetail(null);
    setPanelOpen(false);
    setError(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        topic,
        graph,
        selectedNodeId,
        selectedDetail,
        panelOpen,
        loading,
        error,
        startExploring,
        expandNode,
        selectAndExpand,
        closePanel,
        resetExploration,
      }}
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
