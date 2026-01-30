import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { Clipboard } from "lucide-react";

export function OnboardingStepNode({ data }: NodeProps) {
  return (
    <Card className="px-4 py-2 min-w-[160px] border-2 border-blue-500 bg-blue-50 shadow-lg">
      <div className="flex items-center gap-2">
        <Clipboard className="h-5 w-5 text-blue-600" />
        <div>
          <p className="font-bold text-sm text-blue-900">{data.label || "Onboarding Step"}</p>
          <p className="text-xs text-blue-700 opacity-75">User Setup</p>
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
