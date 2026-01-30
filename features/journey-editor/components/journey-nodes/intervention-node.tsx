import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { HandHelping } from "lucide-react";

export function InterventionNode({ data }: NodeProps) {
  return (
    <Card className="px-4 py-2 min-w-[160px] border-2 border-orange-500 bg-orange-50 shadow-lg">
      <div className="flex items-center gap-2">
        <HandHelping className="h-5 w-5 text-orange-600" />
        <div>
          <p className="font-bold text-sm text-orange-900">{data.label || "Intervention"}</p>
          <p className="text-xs text-orange-700 opacity-75">Offer Service</p>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id="accept" />
      <Handle type="source" position={Position.Right} id="skip" style={{ top: "70%" }} />
    </Card>
  );
}
