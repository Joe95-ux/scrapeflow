import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import { ReactNode } from "react";
import { ColorHandle } from "./Common";

export function NodeOutputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export function NodeOutput({ output}: { output: TaskParam}) {
  return (
    <div className="flex justify-end relative p-3 bg-secondary">
      {!output.hideHandle && (
        <Handle
          id={output.name}
          type="target"
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
