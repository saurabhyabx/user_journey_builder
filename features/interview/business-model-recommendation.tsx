"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Users, CreditCard, Zap, Share2 } from "lucide-react";

interface BusinessModelRecommendationProps {
  interviewData: Record<string, any>;
  journeyId: string;
  onProceed: () => void;
}

const BUSINESS_MODELS = {
  freemium: {
    name: "Freemium",
    icon: "🎁",
    description: "Free core features with premium upgrades",
    bestFor: "Broad market products, viral growth potential",
    benefits: [
      "Maximizes user acquisition (no friction)",
      "Natural upgrade funnel as users get value",
      "Community-driven network effects"
    ],
    touchpoints: [
      "Feature limitations tier",
      "Premium onboarding email sequence",
      "In-app upgrade prompts at key moments"
    ],
    conversionPath: "Free User → Active User → Upgraded → Recurring Revenue"
  },
  "free-trial": {
    name: "Free Trial → Paid",
    icon: "⏱️",
    description: "Full access for limited time, then convert",
    bestFor: "SaaS products, B2B tools, high-value solutions",
    benefits: [
      "Builds product habit before charging",
      "Higher conversion rates from trials",
      "Predictable trial-to-paid metrics"
    ],
    touchpoints: [
      "Trial expiration email sequence",
      "Feature usage monitoring",
      "Upgrade CTA before trial ends"
    ],
    conversionPath: "Trial Signup → Feature Discovery → Convert Before Expiry → Renewal"
  },
  "usage-based": {
    name: "Usage-Based Credits",
    icon: "⚡",
    description: "Pay as you go, based on usage",
    bestFor: "APIs, variable-use tools, compute/processing",
    benefits: [
      "Users only pay for what they use",
      "Natural scaling as users grow",
      "No negotiation on pricing"
    ],
    touchpoints: [
      "Usage dashboard visibility",
      "Credit balance warnings",
      "Tiered credit packages",
      "Volume discount offers"
    ],
    conversionPath: "Free Credits → Usage Tracking → Purchase Credits → Recurring Use"
  },
  paywall: {
    name: "Paywall",
    icon: "🔐",
    description: "Full premium access, one-time or subscription",
    bestFor: "Premium content, specialized tools, niche products",
    benefits: [
      "Clear, simple pricing model",
      "Attracts committed customers",
      "High customer LTV"
    ],
    touchpoints: [
      "Limited free access before paywall",
      "Clear value demonstration",
      "Multiple pricing tiers"
    ],
    conversionPath: "Free Sample → Value Discovery → Paywall → Premium Customer"
  },
  marketplace: {
    name: "Marketplace Fees",
    icon: "🏪",
    description: "Earn commission from transactions",
    bestFor: "Transaction platforms, creator economy, P2P services",
    benefits: [
      "Revenue grows with platform value",
      "Two-sided network effects",
      "Aligned incentives with users"
    ],
    touchpoints: [
      "Seller onboarding & verification",
      "Commission structure clarity",
      "Payment settlement flow",
      "Seller analytics dashboard"
    ],
    conversionPath: "User Signup → Sell/Buy First Item → Recurring Transactions → Growth"
  }
};

function recommendModel(productType: string, userType: string, discoveryChannels: string): keyof typeof BUSINESS_MODELS {
  const type = productType.toLowerCase();
  const user = userType.toLowerCase();
  const channels = discoveryChannels.toLowerCase();

  // SaaS/B2B → Free Trial
  if (type.includes("saas") || type.includes("tool") || user.includes("business") || user.includes("enterprise")) {
    return "free-trial";
  }

  // API/Platform → Usage-Based
  if (type.includes("api") || type.includes("platform") || type.includes("compute") || type.includes("process")) {
    return "usage-based";
  }

  // Marketplace/Transaction → Marketplace
  if (type.includes("market") || type.includes("transaction") || type.includes("creator") || type.includes("p2p")) {
    return "marketplace";
  }

  // Content/Premium → Paywall
  if (type.includes("content") || type.includes("newsletter") || type.includes("premium")) {
    return "paywall";
  }

  // Consumer/Broad → Freemium
  return "freemium";
}

export function BusinessModelRecommendation({
  interviewData,
  journeyId,
  onProceed,
}: BusinessModelRecommendationProps) {
  const [accepted, setAccepted] = useState(false);
  
  const recommendedKey = recommendModel(
    interviewData.productType || "",
    interviewData.userType || "",
    interviewData.discoveryChannels || ""
  );
  
  const model = BUSINESS_MODELS[recommendedKey];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <span className="text-4xl">{model.icon}</span>
          </div>
          <h1 className="mb-2 text-4xl font-bold">Your Strategic Business Model</h1>
          <p className="text-lg text-slate-600">
            Based on your product and users, we recommend:
          </p>
        </div>

        {/* Main Recommendation Card */}
        <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-blue-900">{model.name}</h2>
              <p className="text-lg text-blue-700">{model.description}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="mb-8 rounded-lg bg-white/60 p-4">
            <p className="font-semibold text-slate-700 mb-2">Best for:</p>
            <p className="text-slate-600">{model.bestFor}</p>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Why This Works For You
            </h3>
            <ul className="space-y-3">
              {model.benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Conversion Path */}
          <div className="mb-8 rounded-lg bg-white/60 p-4 border border-slate-200">
            <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Revenue Generation Path
            </p>
            <p className="text-sm text-slate-600 font-mono">{model.conversionPath}</p>
          </div>

          {/* Key Touchpoints */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Key Touchpoints in Your Journey
            </h3>
            <div className="grid gap-2">
              {model.touchpoints.map((tp, idx) => (
                <div key={idx} className="flex gap-3 rounded-lg bg-white p-3 border border-slate-100">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-sm text-slate-700">{tp}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Key Metrics Info */}
        <Card className="mb-8 border border-slate-200 p-6">
          <h3 className="mb-4 font-semibold text-slate-800">Critical Metrics to Track</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Primary Metric</p>
              <p className="text-lg font-bold text-slate-800">
                {recommendedKey === "freemium" && "Free → Paid Conversion %"}
                {recommendedKey === "free-trial" && "Trial → Paid Conversion %"}
                {recommendedKey === "usage-based" && "Credits Purchased per User"}
                {recommendedKey === "paywall" && "Customer LTV"}
                {recommendedKey === "marketplace" && "Commission Revenue per TX"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Secondary Focus</p>
              <p className="text-lg font-bold text-slate-800">
                {recommendedKey === "freemium" && "User Engagement"}
                {recommendedKey === "free-trial" && "Feature Discovery"}
                {recommendedKey === "usage-based" && "Usage Adoption"}
                {recommendedKey === "paywall" && "Content Value"}
                {recommendedKey === "marketplace" && "Network Growth"}
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={onProceed}
            size="lg"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Zap className="mr-2 h-5 w-5" />
            View Generated Journey
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Re-answer Questions
          </Button>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-center text-sm text-slate-500">
          This recommendation is based on your product description and target users.
          <br />
          You can adjust your journey in the editor.
        </p>
      </div>
    </div>
  );
}
