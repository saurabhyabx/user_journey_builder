"use client";

import { useParams, useRouter } from "next/navigation";
import { AIChatInterview } from "@/features/interview/ai-chat-interview";
import { BusinessModelRecommendation } from "@/features/interview/business-model-recommendation";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function AIChatPage() {
  const params = useParams();
  const router = useRouter();
  const journeyId = params.journeyId as string;
  const [error, setError] = useState<string | null>(null);
  const [interviewData, setInterviewData] = useState<Record<string, any> | null>(null);

  const saveInterview = trpc.interview.saveResponse.useMutation();
  const generateJourney = trpc.ai.generateJourney.useMutation();

  const handleComplete = async (data: Record<string, any>) => {
    try {
      setError(null);
      // Save interview response
      await saveInterview.mutateAsync({
        journeyId,
        responses: data,
      });
      // Store interview data and show recommendation screen
      setInterviewData(data);
    } catch (err) {
      setError("Failed to save your interview. Please try again.");
    }
  };

  const handleProceedToEditor = async () => {
    if (!interviewData) return;
    try {
      // Now generate the journey based on the recommendation
      await generateJourney.mutateAsync({
        journeyId,
        interviewData,
      });
      router.push(`/journey/${journeyId}/editor`);
    } catch (err) {
      setError("Failed to generate your journey. Please try again.");
    }
  };

  // Show recommendation screen if interview is complete
  if (interviewData) {
    return (
      <div className="relative">
        {error && (
          <div className="absolute left-1/2 top-4 z-50 w-full max-w-md -translate-x-1/2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <BusinessModelRecommendation
          interviewData={interviewData}
          journeyId={journeyId}
          onProceed={handleProceedToEditor}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {error && (
        <div className="absolute left-1/2 top-4 z-50 w-full max-w-md -translate-x-1/2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <AIChatInterview journeyId={journeyId} onComplete={handleComplete} />
    </div>
  );
}
