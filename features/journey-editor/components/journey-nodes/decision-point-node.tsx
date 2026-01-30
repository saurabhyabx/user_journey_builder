import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { GitBranch } from "lucide-react";

export function DecisionPointNode({ data }: NodeProps) {
  return (
    <Card className="px-4 py-3 min-w-[160px] border-2 border-purple-500 bg-purple-50 shadow-lg">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-purple-600" />
        <div>
          <p className="font-bold text-sm text-purple-900">{data.label || "Decision"}</p>
          <p className="text-xs text-purple-700 opacity-75">Branching Logic</p>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id="yes" />
      <Handle type="source" position={Position.Right} id="no" style={{ top: "70%" }} />
    </Card>
  );
}
