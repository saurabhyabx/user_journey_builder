import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { Flag } from "lucide-react";

const STAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "ACQUISITION": { bg: "#DBEAFE", text: "#0369A1", border: "#10B981" },
  "ACTIVATION": { bg: "#DBEAFE", text: "#0369A1", border: "#3B82F6" },
  "RETENTION": { bg: "#EDE9FE", text: "#6D28D9", border: "#8B5CF6" },
  "MONETIZATION": { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  "REFERRAL": { bg: "#FEE2E2", text: "#7F1D1D", border: "#EF4444" },
};

export function MilestoneNode({ data }: NodeProps) {
  const stageColor = STAGE_COLORS[data.funnelStage] || STAGE_COLORS["RETENTION"];
  
  const stageColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    ENTRY: { bg: "bg-slate-50", border: "border-slate-400", text: "text-slate-900", icon: "📍" },
    PROSPECT: { bg: "bg-cyan-50", border: "border-cyan-400", text: "text-cyan-900", icon: "🔍" },
    CUSTOMER: { bg: "bg-teal-50", border: "border-teal-400", text: "text-teal-900", icon: "👤" },
    RECURRING: { bg: "bg-lime-50", border: "border-lime-400", text: "text-lime-900", icon: "🔄" },
    UPGRADED: { bg: "bg-amber-50", border: "border-amber-400", text: "text-amber-900", icon: "⬆️" },
    TORCHBEARER: { bg: "bg-rose-50", border: "border-rose-400", text: "text-rose-900", icon: "🔥" },
  };

  const stage = data.stage || "ENTRY";
  const colors = stageColors[stage] || stageColors.ENTRY;

  return (
    <Card className={`px-4 py-2 min-w-[160px] border-2 ${colors.border} ${colors.bg} shadow-lg relative`}>
      {data.funnelStage && (
        <div 
          className="absolute -top-2 right-2 px-2 py-1 rounded text-xs font-semibold"
          style={{ backgroundColor: stageColor.bg, color: stageColor.text, border: `1px solid ${stageColor.border}` }}
        >
          {data.funnelStage}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-lg">{colors.icon}</span>
        <div>
          <p className={`font-bold text-sm ${colors.text}`}>{data.label || "Milestone"}</p>
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${colors.text} opacity-60`}>{stage}</span>
            {data.description && (
              <span className={`text-xs ${colors.text} opacity-80 max-w-[150px] truncate`}>{data.description}</span>
            )}
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
