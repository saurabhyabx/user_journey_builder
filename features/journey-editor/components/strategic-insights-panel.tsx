"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { X, TrendingUp, AlertTriangle, Target, Zap } from "lucide-react";

interface StrategicInsightsPanelProps {
  nodes: any[];
  onClose: () => void;
}

export function StrategicInsightsPanel({ nodes, onClose }: StrategicInsightsPanelProps) {
  // Calculate funnel stage distribution
  const stageCount: Record<string, number> = nodes.reduce((acc: Record<string, number>, node) => {
    const stage = node.data?.funnelStage || "UNKNOWN";
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});

  const totalNodes = nodes.length;

  // Get critical moments (conversion, intervention points)
  const criticalNodes = nodes.filter((n) =>
    ["CONVERSION", "INTERVENTION", "DECISION_POINT"].includes(n.data?.type)
  );

  // Calculate dropout risks (nodes without outbound connections)
  const exitNodes = nodes.filter((n) => n.data?.type === "EXIT_POINT");

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">💡</span>
          <h3 className="font-semibold text-slate-900">Strategic Insights</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white rounded-lg transition-colors"
          aria-label="Close insights panel"
        >
          <X className="h-4 w-4 text-slate-500 hover:text-slate-700" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Journey Overview */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Journey Structure
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(stageCount).map(([stage, count]: [string, number]) => (
              <div
                key={stage}
                className="rounded-lg bg-slate-50 p-3 border border-slate-200"
              >
                <p className="text-xs font-medium text-slate-600 mb-1">
                  {stage === "ACQUISITION" && "🎯"}
                  {stage === "ACTIVATION" && "⚡"}
                  {stage === "RETENTION" && "🔄"}
                  {stage === "MONETIZATION" && "💰"}
                  {stage === "REFERRAL" && "🚀"}
                  {stage === "UNKNOWN" && "❓"} {stage}
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {count}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    ({Math.round((count / totalNodes) * 100)}%)
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total Nodes */}
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                Total Journey Nodes
              </p>
              <p className="text-3xl font-bold text-blue-900">{totalNodes}</p>
            </div>
            <Target className="h-8 w-8 text-blue-300" />
          </div>
          <p className="text-xs text-blue-700 mt-2">
            {totalNodes >= 18
              ? "✓ Complete funnel coverage"
              : "⚠ Add more nodes for full coverage"}
          </p>
        </div>

        {/* Critical Moments */}
        {criticalNodes.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500" /> Critical Moments
            </h4>
            <div className="space-y-2">
              {criticalNodes.slice(0, 4).map((node) => (
                <div
                  key={node.id}
                  className="rounded-lg bg-amber-50 p-3 border border-amber-200"
                >
                  <p className="text-xs font-semibold text-amber-900 mb-1">
                    {node.data?.label || "Unnamed"}
                  </p>
                  <p className="text-xs text-amber-700">
                    {node.data?.type === "CONVERSION" &&
                      "🎯 Revenue moment - optimize CTR"}
                    {node.data?.type === "INTERVENTION" &&
                      "🤝 Prevent churn - high impact"}
                    {node.data?.type === "DECISION_POINT" &&
                      "🔀 User segmentation point"}
                  </p>
                </div>
              ))}
              {criticalNodes.length > 4 && (
                <p className="text-xs text-slate-500 px-3">
                  +{criticalNodes.length - 4} more critical moments
                </p>
              )}
            </div>
          </div>
        )}

        {/* Exit Points */}
        {exitNodes.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-red-500" /> Exit Points
            </h4>
            <div className="space-y-2">
              {exitNodes.map((node) => (
                <div
                  key={node.id}
                  className="rounded-lg bg-red-50 p-3 border border-red-200"
                >
                  <p className="text-xs font-semibold text-red-900 mb-1">
                    {node.data?.label || "Unnamed"}
                  </p>
                  <p className="text-xs text-red-700">
                    Add intervention before this point
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600" /> Optimization Tips
          </h4>
          <ul className="space-y-2">
            <li className="text-xs text-slate-600 flex gap-2">
              <span className="text-green-600 font-bold">→</span>
              <span>
                {stageCount["ACTIVATION"] || 0 < 4
                  ? "Add more activation nodes (target 4-5)"
                  : "Activation stage looks comprehensive"}
              </span>
            </li>
            <li className="text-xs text-slate-600 flex gap-2">
              <span className="text-green-600 font-bold">→</span>
              <span>
                {stageCount["MONETIZATION"] || 0 < 3
                  ? "Strengthen monetization flow (target 3-4)"
                  : "Monetization stage is well-structured"}
              </span>
            </li>
            <li className="text-xs text-slate-600 flex gap-2">
              <span className="text-green-600 font-bold">→</span>
              <span>
                {criticalNodes.length < 3
                  ? "Add intervention points at key moments"
                  : "Good distribution of critical moments"}
              </span>
            </li>
          </ul>
        </div>

        {/* Expected Metrics */}
        <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
          <p className="text-xs font-semibold uppercase text-slate-600 mb-3">
            Expected Benchmarks
          </p>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>Activation Rate:</span>
              <span className="font-semibold">25-40%</span>
            </div>
            <div className="flex justify-between">
              <span>Conversion Rate:</span>
              <span className="font-semibold">2-5%</span>
            </div>
            <div className="flex justify-between">
              <span>Retention Day 7:</span>
              <span className="font-semibold">40-60%</span>
            </div>
            <div className="flex justify-between">
              <span>LTV:CAC Ratio:</span>
              <span className="font-semibold">3:1+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-xs text-slate-500 text-center">
          💡 These insights are AI-generated recommendations
        </p>
      </div>
    </div>
  );
}
