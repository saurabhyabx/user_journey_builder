"use client";

import React, { useMemo } from "react";
import {
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Zap,
  Target,
  Clock,
  DollarSign,
  Users,
  AlertOctagon,
  Sparkles
} from "lucide-react";
import { trpc } from "@/lib/trpc";

interface StrategicInsightsPanelProps {
  journeyId: string;
  nodes: any[];
  onClose: () => void;
}

interface BusinessInsight {
  type: "critical" | "warning" | "success" | "opportunity";
  title: string;
  description: string;
  action: string;
  impact: "high" | "medium" | "low";
}

export function StrategicInsightsPanel({ journeyId, nodes, onClose }: StrategicInsightsPanelProps) {
  const { data: journey } = trpc.journey.getById.useQuery({ id: journeyId });

  // Extract AI response data
  const aiResponse = journey?.aiResponse as any;
  const aiInsights: string[] = aiResponse?.insights || [];
  const aiRecommendations: string[] = aiResponse?.recommendations || [];

  // Analyze the journey and generate business insights
  const businessInsights = useMemo(() => {
    const insights: BusinessInsight[] = [];

    // Count nodes by stage
    const stageCount: Record<string, number> = {};
    const typeCount: Record<string, number> = {};

    nodes.forEach((node) => {
      const stage = node.data?.funnelStage || "UNKNOWN";
      const type = node.data?.type || node.type || "UNKNOWN";
      stageCount[stage] = (stageCount[stage] || 0) + 1;
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    // Get node types for analysis
    const hasConversion = (typeCount["CONVERSION"] || 0) > 0;
    const hasDecisionPoints = (typeCount["DECISION_POINT"] || 0) > 0;
    const hasInterventions = (typeCount["INTERVENTION"] || 0) > 0;
    const hasExitPoints = (typeCount["EXIT_POINT"] || 0) > 0;
    const hasTouchpoints = (typeCount["TOUCHPOINT"] || 0) > 0;
    const hasOnboarding = (typeCount["ONBOARDING_STEP"] || 0) > 0;

    // Analyze funnel coverage
    const hasAcquisition = (stageCount["ACQUISITION"] || 0) >= 2;
    const hasActivation = (stageCount["ACTIVATION"] || 0) >= 2;
    const hasRetention = (stageCount["RETENTION"] || 0) >= 2;
    const hasMonetization = (stageCount["MONETIZATION"] || 0) >= 1;
    const hasReferral = (stageCount["REFERRAL"] || 0) >= 1;

    // Find first conversion node index (rough "time to monetization")
    const conversionIndex = nodes.findIndex(
      n => n.data?.type === "CONVERSION" || n.data?.funnelStage === "MONETIZATION"
    );

    // Find first value/milestone node
    const valueIndex = nodes.findIndex(
      n => n.data?.type === "MILESTONE" || n.data?.funnelStage === "ACTIVATION"
    );

    // === CRITICAL ISSUES ===

    if (!hasConversion) {
      insights.push({
        type: "critical",
        title: "No Revenue Path Defined",
        description: "Your journey has no conversion points. Without a clear monetization path, you won't capture value from engaged users.",
        action: "Add a CONVERSION node after users experience the core value (Aha moment).",
        impact: "high"
      });
    }

    if (conversionIndex !== -1 && valueIndex !== -1 && conversionIndex < valueIndex) {
      insights.push({
        type: "critical",
        title: "Asking for Money Before Delivering Value",
        description: "Your journey asks users to pay BEFORE they experience the product's value. This kills conversion rates.",
        action: "Move the monetization step AFTER the Aha moment. Give value first, then ask for payment.",
        impact: "high"
      });
    }

    if (!hasActivation) {
      insights.push({
        type: "critical",
        title: "Weak Activation Flow",
        description: "Users who don't activate in the first session rarely return. Your activation stage needs more depth.",
        action: "Add 2-3 nodes showing the path to the first 'Aha moment' - the moment users feel value.",
        impact: "high"
      });
    }

    // === WARNINGS ===

    if (!hasRetention) {
      insights.push({
        type: "warning",
        title: "No Retention Strategy",
        description: "Acquiring users is 5-7x more expensive than retaining them. Without retention flows, you're burning acquisition spend.",
        action: "Add habit loops: usage triggers, re-engagement emails, streak rewards, or community hooks.",
        impact: "high"
      });
    }

    if (!hasInterventions && hasExitPoints) {
      insights.push({
        type: "warning",
        title: "Exit Points Without Recovery",
        description: "You have exit points but no interventions. Every user who leaves is lost forever.",
        action: "Add INTERVENTION nodes after each EXIT_POINT with win-back strategies (email, discount, support).",
        impact: "medium"
      });
    }

    if (!hasDecisionPoints) {
      insights.push({
        type: "warning",
        title: "Linear Journey Ignores User Segments",
        description: "All users are different. A linear flow treats power users and beginners the same.",
        action: "Add DECISION_POINT nodes to personalize paths based on user behavior or persona.",
        impact: "medium"
      });
    }

    if (!hasTouchpoints) {
      insights.push({
        type: "warning",
        title: "No Communication Touchpoints",
        description: "Without email/push/SMS touchpoints, you have no way to bring users back to the product.",
        action: "Add TOUCHPOINT nodes for welcome emails, onboarding drips, and re-engagement campaigns.",
        impact: "medium"
      });
    }

    if (!hasReferral) {
      insights.push({
        type: "opportunity",
        title: "Missing Viral Growth Loop",
        description: "Happy users are your cheapest acquisition channel. You're not leveraging them.",
        action: "Add a REFERRAL stage: invite friends, share progress, or exclusive perks for advocates.",
        impact: "medium"
      });
    }

    // === SUCCESS INDICATORS ===

    if (hasAcquisition && hasActivation && hasMonetization) {
      insights.push({
        type: "success",
        title: "Core Funnel is Complete",
        description: "You have Acquisition → Activation → Monetization covered. The fundamentals are in place.",
        action: "Focus on optimizing conversion rates between stages.",
        impact: "low"
      });
    }

    if (hasInterventions) {
      insights.push({
        type: "success",
        title: "Proactive Churn Prevention",
        description: "You have intervention nodes to catch users before they leave. Smart.",
        action: "Test different intervention messages to find what resonates.",
        impact: "low"
      });
    }

    // === OPPORTUNITIES ===

    if (nodes.length < 15) {
      insights.push({
        type: "opportunity",
        title: "Journey May Be Too Simple",
        description: "Real user journeys have nuance. A sparse map might miss edge cases and drop-off points.",
        action: "Add more detail: what happens if user doesn't complete setup? What if they churn after trial?",
        impact: "low"
      });
    }

    return insights;
  }, [nodes, journey]);

  // Sort insights by priority
  const sortedInsights = useMemo(() => {
    const typeOrder = { critical: 0, warning: 1, opportunity: 2, success: 3 };
    return [...businessInsights].sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
  }, [businessInsights]);

  const criticalCount = sortedInsights.filter(i => i.type === "critical").length;
  const warningCount = sortedInsights.filter(i => i.type === "warning").length;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertOctagon className="h-5 w-5 text-red-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "success": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "opportunity": return <Sparkles className="h-5 w-5 text-purple-500" />;
      default: return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightStyle = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-50 border-red-200";
      case "warning": return "bg-amber-50 border-amber-200";
      case "success": return "bg-green-50 border-green-200";
      case "opportunity": return "bg-purple-50 border-purple-200";
      default: return "bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          <h3 className="font-semibold text-white">Business Insights</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-white/70 hover:text-white" />
        </button>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 border-b border-slate-100">
        {criticalCount > 0 && (
          <div className="flex items-center gap-1.5 text-red-600">
            <AlertOctagon className="h-4 w-4" />
            <span className="text-sm font-semibold">{criticalCount} Critical</span>
          </div>
        )}
        {warningCount > 0 && (
          <div className="flex items-center gap-1.5 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-semibold">{warningCount} Warnings</span>
          </div>
        )}
        {criticalCount === 0 && warningCount === 0 && (
          <div className="flex items-center gap-1.5 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-semibold">Journey looks healthy!</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Business Insights */}
        {sortedInsights.map((insight, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-4 ${getInsightStyle(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 mb-1">
                  {insight.title}
                </h4>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                  {insight.description}
                </p>
                <div className="flex items-start gap-2 bg-white/60 rounded-lg p-2.5 border border-slate-200/50">
                  <ArrowRight className="h-4 w-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 font-medium">
                    {insight.action}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* AI-Generated Insights (if any) */}
        {aiInsights.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-indigo-500" /> AI Analysis
            </h4>
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className="mb-2 rounded-lg bg-indigo-50 border border-indigo-200 p-3"
              >
                <p className="text-sm text-indigo-900">{insight}</p>
              </div>
            ))}
          </div>
        )}

        {/* AI Recommendations */}
        {aiRecommendations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-green-600" /> AI Recommendations
            </h4>
            {aiRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="mb-2 rounded-lg bg-green-50 border border-green-200 p-3 flex gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-900">{rec}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-xs text-slate-500 text-center">
          Analyzed {nodes.length} nodes • {sortedInsights.length} insights found
        </p>
      </div>
    </div>
  );
}
