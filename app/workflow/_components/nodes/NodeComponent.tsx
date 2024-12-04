import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";

const NodeComponet = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = TaskRegistry[nodeData.type];
  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      <NodeHeader taskType={nodeData.type}/>
      <NodeInputs>
        {task.inputs.map((input) =>(
          <NodeInput key={input.name} input={input} nodeId={props.id}/>
        ))}
      </NodeInputs>

      <NodeOutputs>
        {task.outputs.map((output) =>(
          <NodeOutput key={output.name} output={output}/>
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});

export default NodeComponet;
NodeComponet.displayName = "NodeComponent";
