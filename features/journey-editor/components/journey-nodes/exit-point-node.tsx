import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { StopCircle } from "lucide-react";

export function ExitPointNode({ data }: NodeProps) {
  return (
    <Card className="px-4 py-2 min-w-[160px] border-2 border-red-500 bg-red-50 shadow-lg">
      <div className="flex items-center gap-2">
        <StopCircle className="h-5 w-5 text-red-600" />
        <div>
          <p className="font-bold text-sm text-red-900">{data.label || "Journey End"}</p>
          <p className="text-xs text-red-700 opacity-75">Exit or Churn</p>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
    </Card>
  );
}
