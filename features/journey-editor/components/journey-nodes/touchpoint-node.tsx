import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const STAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "ACQUISITION": { bg: "#DBEAFE", text: "#0369A1", border: "#10B981" },
  "ACTIVATION": { bg: "#DBEAFE", text: "#0369A1", border: "#3B82F6" },
  "RETENTION": { bg: "#EDE9FE", text: "#6D28D9", border: "#8B5CF6" },
  "MONETIZATION": { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  "REFERRAL": { bg: "#FEE2E2", text: "#7F1D1D", border: "#EF4444" },
};

export function TouchpointNode({ data }: NodeProps) {
  const stageColor = STAGE_COLORS[data.funnelStage] || STAGE_COLORS["MONETIZATION"];
  
  return (
    <Card className="px-4 py-2 min-w-[160px] border-2 border-indigo-500 bg-indigo-50 shadow-lg relative">
      {data.funnelStage && (
        <div 
          className="absolute -top-2 right-2 px-2 py-1 rounded text-xs font-semibold"
          style={{ backgroundColor: stageColor.bg, color: stageColor.text, border: `1px solid ${stageColor.border}` }}
        >
          {data.funnelStage}
        </div>
      )}
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
