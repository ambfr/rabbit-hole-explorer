import { useCallback, useEffect } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useApp } from "../context/AppContext";
import TopicNode from "./TopicNode";

const nodeTypes = { topicNode: TopicNode };

export default function GraphView() {
  const { graph, selectedNodeId, loading, selectAndExpand } = useApp();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(
      graph.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          selected: node.id === selectedNodeId,
        },
      })),
    );
    setEdges(graph.edges);
  }, [graph, selectedNodeId, setNodes, setEdges]);

  const onInit = useCallback((instance) => {
    if (graph.nodes.length > 0) {
      instance.fitView({ padding: 0.35, duration: 300 });
    }
  }, [graph.nodes.length]);

  const onNodeClick = useCallback(
    (_event, node) => {
      if (!loading) {
        selectAndExpand(node.id, node.data.label);
      }
    },
    [loading, selectAndExpand],
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onInit={onInit}
        onNodeClick={onNodeClick}
        minZoom={0.15}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="graph-flow"
      >
        <Background color="rgba(251, 191, 36, 0.06)" gap={24} size={1} />
        <Controls
          showInteractive={false}
          className="!border-zinc-800 !bg-zinc-950/90 !shadow-none [&>button]:!border-zinc-800 [&>button]:!bg-zinc-900 [&>button]:!fill-zinc-400 [&>button:hover]:!bg-zinc-800"
        />
      </ReactFlow>
    </div>
  );
}
