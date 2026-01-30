"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Loader } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function NewJourneyPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Creating your journey...");
  const createJourney = trpc.journey.create.useMutation();

  const hasInitiated = useRef(false);

  useEffect(() => {
    if (hasInitiated.current) return;
    hasInitiated.current = true;

    const create = async () => {
      try {
        setError(null);
        setStatus("Creating your journey...");
        console.log("[NewJourney] Starting journey creation...");
        
        const journey = await createJourney.mutateAsync({
          title: "Untitled Journey",
        });

        console.log("[NewJourney] Journey created with ID:", journey.id);
        setStatus("Redirecting to interview...");
        
        // Use replace to prevent back button issues
        const interviewUrl = `/journey/${journey.id}/interview`;
        console.log("[NewJourney] Navigating to:", interviewUrl);
        
        // Direct navigation
        router.replace(interviewUrl);
        
      } catch (err: any) {
        console.error("[NewJourney] Creation failed:", err);
        setError(err?.message || "Failed to create a new journey. Please refresh and try again.");
      }
    };

    create();
  }, [router, createJourney]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <Loader className="mx-auto h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-lg font-medium">{status}</p>
        {error && (
          <div className="mt-4">
            <p className="text-sm text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
