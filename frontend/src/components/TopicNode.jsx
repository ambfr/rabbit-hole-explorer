import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

function TopicNode({ data }) {
  return (
    <div className={`topic-node${data.selected ? " topic-node--selected" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="!border-amber-200/30 !bg-zinc-800"
      />
      <span>{data.label}</span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-amber-200/30 !bg-zinc-800"
      />
    </div>
  );
}

export default memo(TopicNode);
