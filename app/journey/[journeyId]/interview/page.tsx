import { InterviewChoice } from "@/features/interview/interview-choice";
import { redirect } from "next/navigation";

interface InterviewPageProps {
  params: Promise<{
    journeyId: string;
  }>;
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { journeyId } = await params;

  if (!journeyId) {
    redirect("/");
  }

  return <InterviewChoice journeyId={journeyId} />;
}
