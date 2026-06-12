import dagre from "@dagrejs/dagre";

export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 56;
const COLLISION_PADDING = 36;

export function toId(topic) {
  return topic.trim().toLowerCase();
}

const edgeStyle = { stroke: "rgba(251, 191, 36, 0.35)", strokeWidth: 1.5 };

function boxesOverlap(a, b) {
  return !(
    a.x + NODE_WIDTH + COLLISION_PADDING < b.x ||
    b.x + NODE_WIDTH + COLLISION_PADDING < a.x ||
    a.y + NODE_HEIGHT + COLLISION_PADDING < b.y ||
    b.y + NODE_HEIGHT + COLLISION_PADDING < a.y
  );
}

function getOccupiedBoxes(nodes, excludeIds = new Set()) {
  return nodes
    .filter((n) => !excludeIds.has(n.id))
    .map((n) => ({ x: n.position.x, y: n.position.y }));
}

function resolveCollision(position, occupied) {
  let pos = { ...position };
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const collision = occupied.find((box) => boxesOverlap(pos, box));
    if (!collision) return pos;
    pos = {
      x: pos.x + 48,
      y: pos.y + 32,
    };
  }
  return pos;
}

function layoutNewChildren(parent, childIds) {
  if (childIds.length === 0) return {};

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: "TB",
    nodesep: 72,
    ranksep: 110,
    marginx: 24,
    marginy: 24,
  });

  graph.setNode(parent.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  childIds.forEach((id) => {
    graph.setNode(id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    graph.setEdge(parent.id, id);
  });

  dagre.layout(graph);

  const parentLayout = graph.node(parent.id);
  const offsetX = parent.position.x + NODE_WIDTH / 2 - parentLayout.x;
  const offsetY = parent.position.y + NODE_HEIGHT / 2 - parentLayout.y;

  const positions = {};
  childIds.forEach((id) => {
    const layout = graph.node(id);
    positions[id] = {
      x: layout.x - NODE_WIDTH / 2 + offsetX,
      y: layout.y - NODE_HEIGHT / 2 + offsetY,
    };
  });

  return positions;
}

export function mergeExpansion(prev, topic, data, { isRoot = false } = {}) {
  const nodes = prev.nodes.map((n) => ({
    ...n,
    position: { ...n.position },
    data: { ...n.data },
  }));
  const edges = [...prev.edges];
  const nodeId = toId(topic);
  const label = topic.trim();

  let node = nodes.find((n) => n.id === nodeId);
  if (!node) {
    node = {
      id: nodeId,
      type: "topicNode",
      position: isRoot ? { x: 400, y: 280 } : { x: 400, y: 280 },
      data: {
        label,
        summary: data.summary,
        relatedTopics: data.related_topics,
      },
    };
    nodes.push(node);
  } else {
    node.data.summary = data.summary;
    node.data.relatedTopics = data.related_topics;
    node.data.label = label;
  }

  const newChildIds = [];
  data.related_topics.forEach((related) => {
    const relatedId = toId(related);
    if (!nodes.find((n) => n.id === relatedId)) {
      newChildIds.push(relatedId);
      nodes.push({
        id: relatedId,
        type: "topicNode",
        position: { ...node.position },
        data: { label: related },
      });
    }

    const edgeId = `${nodeId}-${relatedId}`;
    if (!edges.find((e) => e.id === edgeId)) {
      edges.push({
        id: edgeId,
        source: nodeId,
        target: relatedId,
        type: "smoothstep",
        style: edgeStyle,
      });
    }
  });

  if (newChildIds.length > 0) {
    const dagrePositions = layoutNewChildren(node, newChildIds);
    const occupied = getOccupiedBoxes(nodes, new Set(newChildIds));

    newChildIds.forEach((childId) => {
      const target = nodes.find((n) => n.id === childId);
      const resolved = resolveCollision(dagrePositions[childId], occupied);
      target.position = resolved;
      occupied.push({ x: resolved.x, y: resolved.y });
    });
  }

  return { nodes, edges };
}
