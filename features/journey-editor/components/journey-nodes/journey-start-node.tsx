import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export function JourneyStartNode({ data }: NodeProps) {
  return (
    <Card className="px-4 py-2 min-w-[150px] border-2 border-green-500 bg-green-50 shadow-lg">
      <div className="flex items-center gap-2">
        <Rocket className="h-5 w-5 text-green-600" />
        <div>
          <p className="font-bold text-sm text-green-900">{data.label || "Journey Start"}</p>
          <p className="text-xs text-green-700 opacity-75 max-w-[150px] truncate">
            {data.description || "Entry Point"}
          </p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
