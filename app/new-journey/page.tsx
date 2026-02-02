"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { SkeletonJourney } from "@/components/ui/skeleton-journey";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NewJourneyPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Initializing strategy engine...");
  const createJourney = trpc.journey.create.useMutation();

  const hasInitiated = useRef(false);

  useEffect(() => {
    if (hasInitiated.current) return;
    hasInitiated.current = true;

    const create = async () => {
      try {
        setError(null);
        // Artificial delay effectively improves "perceived quality" 
        // by showing the fancy skeleton for a moment instead of a flicker
        await new Promise(r => setTimeout(r, 800));

        setStatus("Creating your journey canvas...");
        console.log("[NewJourney] Starting journey creation...");

        const journey = await createJourney.mutateAsync({
          title: "Untitled Journey",
        });

        console.log("[NewJourney] Journey created with ID:", journey.id);
        setStatus("Redirecting to interview interface...");

        // Brief pause to let the user read the success state
        await new Promise(r => setTimeout(r, 500));

        const interviewUrl = `/journey/${journey.id}/interview`;
        console.log("[NewJourney] Navigating to:", interviewUrl);

        router.replace(interviewUrl);

      } catch (err: unknown) {
        console.error("[NewJourney] Creation failed:", err);
        setError(err instanceof Error ? err.message : "Failed to create a new journey. Please refresh and try again.");
      }
    };

    create();
  }, [router, createJourney]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center max-w-md p-8 bg-card rounded-2xl shadow-xl border border-destructive/20"
          >
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 text-destructive text-xl font-bold">!</div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="default"
              className="w-full"
            >
              Try Again
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl"
          >
            <SkeletonJourney />
            <motion.p
              key={status} // Animate text changes
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6 text-muted-foreground font-medium"
            >
              {status}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
