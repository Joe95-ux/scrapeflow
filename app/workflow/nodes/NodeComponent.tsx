import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";

const NodeComponet = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      <NodeHeader taskType={nodeData.type}/>
    </NodeCard>
  );
});

export default NodeComponet;
NodeComponet.displayName = "NodeComponent";
