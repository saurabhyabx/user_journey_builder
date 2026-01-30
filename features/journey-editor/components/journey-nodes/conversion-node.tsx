import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export function ConversionNode({ data }: NodeProps) {
  return (
    <Card className="px-4 py-2 min-w-[160px] border-2 border-emerald-500 bg-emerald-50 shadow-lg">
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-emerald-600" />
        <div>
          <p className="font-bold text-sm text-emerald-900">{data.label || "Conversion"}</p>
          <p className="text-xs text-emerald-700 opacity-75">Purchase/Signup</p>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
