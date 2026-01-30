"use client";

import { JourneyEditor } from "@/features/journey-editor/components/journey-editor";
import { useParams } from "next/navigation";

export default function EditorPage() {
  const params = useParams();
  const journeyId = params.journeyId as string;

  return <JourneyEditor journeyId={journeyId} />;
}
