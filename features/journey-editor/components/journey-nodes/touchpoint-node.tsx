import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function TouchpointNode({ data }: NodeProps) {
  return (
    <Card className="px-4 py-2 min-w-[160px] border-2 border-indigo-500 bg-indigo-50 shadow-lg">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-indigo-600" />
        <div>
          <p className="font-bold text-sm text-indigo-900">{data.label || "Touchpoint"}</p>
          <p className="text-xs text-indigo-700 opacity-75">User Contact</p>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
