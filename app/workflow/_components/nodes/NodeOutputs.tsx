import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import { ReactNode } from "react";
import { ColorHandle } from "./Common";
import NodeParamField from "./NodeParamField";

export function NodeOutputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export function NodeOutput({ output}: { output: TaskParam}) {
  return (
    <div className="flex justify-end relative p-3 bg-secondary">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      {!output.hideHandle && (
        <Handle
          id={output.name}
          type="source"
          position={Position.Right}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4",
            ColorHandle[output.type]
          )}
        />
      )}
    </div>
  );
}
