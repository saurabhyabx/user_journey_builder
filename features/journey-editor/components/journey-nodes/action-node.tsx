import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

export function ActionNode({ data }: NodeProps) {
  return (
    <Card className="px-4 py-2 min-w-[160px] border-2 border-yellow-500 bg-yellow-50 shadow-lg">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-yellow-600" />
        <div>
          <p className="font-bold text-sm text-yellow-900">{data.label || "Action"}</p>
          <p className="text-xs text-yellow-700 opacity-75 max-w-[150px] truncate">
            {data.description || "User Action"}
          </p>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
