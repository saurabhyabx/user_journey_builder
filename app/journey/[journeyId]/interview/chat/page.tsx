"use client";

import { useParams, useRouter } from "next/navigation";
import { AIChatInterview } from "@/features/interview/ai-chat-interview";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function AIChatPage() {
  const params = useParams();
  const router = useRouter();
  const journeyId = params.journeyId as string;
  const [error, setError] = useState<string | null>(null);

  const saveInterview = trpc.interview.saveResponse.useMutation();
  const generateJourney = trpc.ai.generateJourney.useMutation();

  const handleComplete = async (data: Record<string, any>) => {
    try {
      setError(null);
      await saveInterview.mutateAsync({
        journeyId,
        responses: data,
      });
      await generateJourney.mutateAsync({
        journeyId,
        interviewData: data,
      });
      router.push(`/journey/${journeyId}/editor`);
    } catch (err) {
      setError("Failed to generate your journey. Please try again.");
    }
  };

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
