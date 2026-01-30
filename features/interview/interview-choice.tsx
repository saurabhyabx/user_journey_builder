"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, FileText, Zap, BarChart3 } from "lucide-react";

interface InterviewChoiceProps {
  journeyId: string;
}

export function InterviewChoice({ journeyId }: InterviewChoiceProps) {
  const [selectedFlow, setSelectedFlow] = useState<"ai" | "form" | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">How would you like to build your journey?</h1>
          <p className="text-lg text-muted-foreground">
            Choose the approach that fits your style. Both create amazing user journeys!
          </p>
        </div>

        {/* Two Options Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Option 1: AI Chat */}
          <div className="flex flex-col">
            <Card
              className={`flex-1 cursor-pointer transition-all hover:shadow-lg ${
                selectedFlow === "ai"
                  ? "border-primary border-2 bg-blue-50"
                  : "border-2 border-transparent"
              }`}
              onClick={() => setSelectedFlow("ai")}
            >
              <div className="p-8">
                {/* Icon */}
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>

                {/* Title & Badge */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold">AI Chat Interview</h2>
                    <p className="text-sm font-medium text-blue-600">⚡ Fastest</p>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-6 text-muted-foreground">
                  Have a natural conversation with our AI. It asks smart questions one by one,
                  understands your answers, and builds your journey as you talk.
                </p>

                {/* Features */}
                <div className="mb-8 space-y-3">
                  <FeatureItem icon="💬" text="Conversational & natural" />
                  <FeatureItem icon="🤖" text="AI adapts questions to your answers" />
                  <FeatureItem icon="⏱️" text="Takes ~10 minutes" />
                  <FeatureItem icon="✨" text="Best for quick validation" />
                </div>

                {/* CTA */}
                <Link href={`/journey/${journeyId}/interview/chat`} className="block">
                  <Button
                    className="w-full"
                    variant={selectedFlow === "ai" ? "default" : "outline"}
                  >
                    Start AI Interview
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Option 2: Detailed Form */}
          <div className="flex flex-col">
            <Card
              className={`flex-1 cursor-pointer transition-all hover:shadow-lg ${
                selectedFlow === "form"
                  ? "border-primary border-2 bg-purple-50"
                  : "border-2 border-transparent"
              }`}
              onClick={() => setSelectedFlow("form")}
            >
              <div className="p-8">
                {/* Icon */}
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>

                {/* Title & Badge */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold">Detailed Form</h2>
                    <p className="text-sm font-medium text-purple-600">📋 More Rich</p>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-6 text-muted-foreground">
                  Fill out structured forms organized by category. Great for comprehensive
                  planning and detailed analysis of your product strategy.
                </p>

                {/* Features */}
                <div className="mb-8 space-y-3">
                  <FeatureItem icon="📝" text="6 organized category pages" />
                  <FeatureItem icon="📊" text="Deeper strategic insights" />
                  <FeatureItem icon="🎯" text="Takes ~20-30 minutes" />
                  <FeatureItem icon="💡" text="Best for comprehensive planning" />
                </div>

                {/* CTA */}
                <Link href={`/journey/${journeyId}/interview/form`} className="block">
                  <Button
                    className="w-full"
                    variant={selectedFlow === "form" ? "default" : "outline"}
                  >
                    Start Detailed Form
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16">
          <h3 className="mb-8 text-center text-xl font-bold">Compare Both Approaches</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">AI Chat</th>
                  <th className="px-6 py-4 text-center font-semibold">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-6 py-4">Time to complete</td>
                  <td className="px-6 py-4 text-center">~10 min ⚡</td>
                  <td className="px-6 py-4 text-center">~20-30 min</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Ease of use</td>
                  <td className="px-6 py-4 text-center">Very Easy ✨</td>
                  <td className="px-6 py-4 text-center">Easy</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Detail level</td>
                  <td className="px-6 py-4 text-center">Good</td>
                  <td className="px-6 py-4 text-center">Comprehensive 📊</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">AI adaptation</td>
                  <td className="px-6 py-4 text-center">Yes 🤖</td>
                  <td className="px-6 py-4 text-center">No</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Follow-up questions</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                  <td className="px-6 py-4 text-center">Fixed</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Journey quality</td>
                  <td className="px-6 py-4 text-center">Excellent</td>
                  <td className="px-6 py-4 text-center">Excellent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm text-muted-foreground">
            <strong>Can't decide?</strong> Try the <strong>AI Chat</strong> if you're in a hurry or want a
            natural experience. Use <strong>Detailed Form</strong> if you prefer structured input and want to
            provide maximum detail.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
