import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { expandTopic, getRandomTopic } from "../api/client";
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
  const [autoMode, setAutoMode] = useState(false);
  const [exploredCount, setExploredCount] = useState(0);
  const [depth, setDepth] = useState(0);
  const autoModeRef = useRef(autoMode);
  useEffect(() => {
    autoModeRef.current = autoMode;
  }, [autoMode]);

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
      if (autoModeRef.current) {
        setAutoMode(false);
        setError("Switched to manual exploration");
        setTimeout(() => setError(null), 2500);
      }
      setSelectedNodeId(nodeId);
      setPanelOpen(true);
      setSelectedDetail({
        label,
        summary: null,
        relatedTopics: [],
        loading: true,
      });

      const alreadyExpanded = graph.edges.some((e) => e.source === nodeId);

      if (alreadyExpanded) {
        // Just fetch summary for display, don't modify the graph
        try {
          setLoading(true);
          const data = await expandTopic(label);
          setSelectedDetail({
            label,
            summary: data.summary,
            relatedTopics: data.related_topics,
            loading: false,
          });
        } catch (err) {
          setError(err.message || "Failed to fetch topic info");
          setSelectedDetail((prev) => (prev ? { ...prev, loading: false } : null));
        } finally {
          setLoading(false);
        }
        return;
      }

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
    [expandNode, graph.edges],
  );

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setSelectedNodeId(null);
    setSelectedDetail(null);
  }, []);

  const stopAutoMode = useCallback(() => {
    setAutoMode(false);
  }, []);

  const pauseAutoMode = useCallback(() => setAutoMode("paused"), []);
  const resumeAutoMode = useCallback(() => setAutoMode("running"), []);

  const startRandomRabbitHole = useCallback(async () => {
    setGraph({ nodes: [], edges: [] });
    setSelectedNodeId(null);
    setSelectedDetail(null);
    setPanelOpen(false);
    setError(null);
    setExploredCount(0);
    setDepth(0);
    navigate("/explore");

    const { topic: randomTopicValue } = await getRandomTopic();

    setPanelOpen(true);
    setSelectedDetail({ label: randomTopicValue, summary: null, relatedTopics: [], loading: true });

    const data = await expandNode(randomTopicValue, { isRoot: true });
    if (data) {
      setSelectedNodeId(toId(randomTopicValue));
      setSelectedDetail({
        label: randomTopicValue,
        summary: data.summary,
        relatedTopics: data.related_topics,
        loading: false,
      });
      setExploredCount(1);
      setDepth(1);
      setAutoMode("running");
    }
  }, [expandNode, navigate]);

  const loadSavedGraph = useCallback(
    (savedGraph) => {
      setGraph({ nodes: savedGraph.nodes, edges: savedGraph.edges });
      setSelectedNodeId(null);
      setSelectedDetail(null);
      setPanelOpen(false);
      setError(null);
      setTopic(savedGraph.title);
      navigate("/explore");
    },
    [navigate],
  );

  useEffect(() => {
    if (autoMode !== "running") return;

    const interval = setInterval(() => {
      if (autoModeRef.current !== "running") return;

      setGraph((currentGraph) => {
        const expandedIds = new Set(currentGraph.edges.map((e) => e.source));
        const candidates = currentGraph.nodes.filter((n) => !expandedIds.has(n.id));

        if (candidates.length === 0) {
          setAutoMode(false);
          return currentGraph;
        }

        const pick = candidates[Math.floor(Math.random() * candidates.length)];

        expandNode(pick.data.label).then((data) => {
          if (data) {
            setExploredCount((c) => c + 1);
            setDepth((d) => d + 1);
          }
        });

        return currentGraph;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [autoMode, expandNode]);


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
      autoMode,
      exploredCount,
      depth,
      startExploring,
      startRandomRabbitHole,
      stopAutoMode,
      pauseAutoMode,
      resumeAutoMode,
      expandNode,
      selectAndExpand,
      closePanel,
      resetExploration,
      loadSavedGraph,
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
