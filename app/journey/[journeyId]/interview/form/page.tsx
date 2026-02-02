"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, Loader } from "lucide-react";
import { trpc } from "@/lib/trpc";

const INTERVIEW_PAGES = [
  {
    id: "product_identity",
    title: "Product Identity",
    description: "Tell us about your product and the problem it solves",
    color: "blue",
    questions: [
      {
        key: "product_type",
        label: "What type of product are you building?",
        type: "select",
        options: ["SaaS", "Mobile App", "E-commerce", "Marketplace", "API/Tool", "Other"],
        required: true,
      },
      {
        key: "product_description",
        label: "One-sentence description of your product",
        type: "text",
        placeholder: "What does your product do?",
        required: true,
      },
      {
        key: "problem_solved",
        label: "What problem does it solve?",
        type: "textarea",
        placeholder: "Describe the pain point your users experience...",
        required: true,
      },
    ],
  },
  {
    id: "target_users",
    title: "Target Users",
    description: "Who are you building this for?",
    color: "purple",
    questions: [
      {
        key: "user_type",
        label: "Who is your primary user?",
        type: "select",
        options: ["Individual", "SMB", "Enterprise", "Developer", "Creator", "Student"],
        required: true,
      },
      {
        key: "experience_level",
        label: "What's their experience level?",
        type: "select",
        options: ["Beginner", "Intermediate", "Advanced", "Mixed"],
        required: true,
      },
      {
        key: "pain_point",
        label: "What's their main pain point?",
        type: "textarea",
        placeholder: "Describe their biggest challenge...",
        required: true,
      },
    ],
  },
  {
    id: "acquisition",
    title: "User Acquisition",
    description: "How do users discover your product?",
    color: "green",
    questions: [
      {
        key: "discovery_channels",
        label: "How do users discover you? (Select all that apply)",
        type: "checkbox",
        options: ["Google", "Social Media", "Word of Mouth", "Paid Ads", "Content", "Product Hunt", "Partnerships"],
        required: false,
      },
      {
        key: "first_action",
        label: "What's the first action users take?",
        type: "select",
        options: ["Signup", "Explore Free", "Request Demo", "Talk to Sales", "Watch Video"],
        required: true,
      },
      {
        key: "data_collected",
        label: "What info do you collect at signup?",
        type: "textarea",
        placeholder: "Email, Name, Phone, Company, etc...",
        required: false,
      },
    ],
  },
  {
    id: "core_experience",
    title: "Core Experience",
    description: "What happens after users sign up?",
    color: "orange",
    questions: [
      {
        key: "primary_action",
        label: "What's the primary action users take?",
        type: "text",
        placeholder: "Create, Upload, Send, etc...",
        required: true,
      },
      {
        key: "usage_frequency",
        label: "How often do they use your product?",
        type: "select",
        options: ["Daily", "Weekly", "Monthly", "As Needed"],
        required: true,
      },
      {
        key: "return_drivers",
        label: "What brings them back? (Select all that apply)",
        type: "checkbox",
        options: ["New Content", "Notifications", "Habit", "Collaboration", "Need-based", "Progress Tracking"],
        required: false,
      },
    ],
  },
  {
    id: "monetization",
    title: "Monetization",
    description: "How do you make money?",
    color: "red",
    questions: [
      {
        key: "revenue_model",
        label: "What's your revenue model?",
        type: "select",
        options: ["Free Forever", "Freemium", "Free Trial → Paid", "Paid Only", "Usage-based", "One-time"],
        required: true,
      },
      {
        key: "upgrade_trigger",
        label: "What triggers upgrades?",
        type: "select",
        options: ["Hit Limits", "Need Features", "Team Growth", "Trial Ends", "After Success"],
        required: true,
      },
      {
        key: "price_range",
        label: "What's your price range?",
        type: "select",
        options: ["<$10", "$10-50", "$50-200", "$200+", "One-time", "Custom Enterprise"],
        required: true,
      },
    ],
  },
  {
    id: "retention_growth",
    title: "Retention & Growth",
    description: "How do users stay and grow with you?",
    color: "indigo",
    questions: [
      {
        key: "success_definition",
        label: "How do you define user success?",
        type: "textarea",
        placeholder: "When is a user successful with your product?",
        required: true,
      },
      {
        key: "growth_mechanisms",
        label: "How do users grow? (Select all that apply)",
        type: "checkbox",
        options: ["Referrals", "Reviews", "Case Studies", "Social Sharing", "Community", "Word of Mouth"],
        required: false,
      },
      {
        key: "churn_reasons",
        label: "Why do users leave? (Select all that apply)",
        type: "checkbox",
        options: ["Found Alternative", "Too Complex", "Too Expensive", "No Need", "Poor Support", "Missing Features"],
        required: false,
      },
    ],
  },
];

export default function DetailedFormPage() {
  const params = useParams();
  const router = useRouter();
  const journeyId = params.journeyId as string;
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveInterview = trpc.interview.saveResponse.useMutation();
  const generateJourney = trpc.ai.generateJourney.useMutation();

  const currentPage = INTERVIEW_PAGES[currentPageIndex];
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === INTERVIEW_PAGES.length - 1;
  const progress = Math.round(((currentPageIndex + 1) / INTERVIEW_PAGES.length) * 100);

  const handleInputChange = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null); // Clear error when user types
  };

  const validateCurrentPage = (): boolean => {
    const requiredFields = currentPage.questions.filter(q => q.required);
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      const value = formData[field.key];
      if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        missingFields.push(field.label);
      }
      // For text/textarea fields, require minimum 3 characters
      if (value && typeof value === 'string' && (field.type === 'text' || field.type === 'textarea')) {
        if (value.trim().length < 3) {
          setError(`"${field.label}" must be at least 3 characters long.`);
          return false;
        }
      }
    }

    if (missingFields.length > 0) {
      setError(`Please fill in required fields: ${missingFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentPage()) {
      return;
    }
    
    setError(null);
    if (isLastPage) {
      handleSubmit();
    } else {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstPage) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const interviewData = mapFormToInterviewData(formData);
      await saveInterview.mutateAsync({
        journeyId,
        responses: interviewData,
      });
      await generateJourney.mutateAsync({
        journeyId,
        interviewData,
      });
      setCompleted(true);
      router.push(`/journey/${journeyId}/editor`);
    } catch {
      setError("Failed to generate your journey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">🎉 Perfect!</CardTitle>
            <CardDescription className="text-center">
              Your information has been saved. Generating your journey...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{currentPage.title}</h1>
          <p className="mb-4 text-muted-foreground">{currentPage.description}</p>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>
                Page {currentPageIndex + 1} of {INTERVIEW_PAGES.length}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="mb-8">
          <CardContent className="space-y-6 pt-6">
            {currentPage.questions.map((question) => (
              <div key={question.key} className="space-y-2">
                <label className="text-sm font-medium">
                  {question.label}
                  {question.required && <span className="text-red-500"> *</span>}
                </label>

                {question.type === "text" && (
                  <Input
                    type="text"
                    placeholder={question.placeholder}
                    value={formData[question.key] || ""}
                    onChange={(e) => handleInputChange(question.key, e.target.value)}
                  />
                )}

                {question.type === "textarea" && (
                  <Textarea
                    placeholder={question.placeholder}
                    value={formData[question.key] || ""}
                    onChange={(e) => handleInputChange(question.key, e.target.value)}
                    rows={4}
                  />
                )}

                {question.type === "select" && (
                  <select
                    value={formData[question.key] || ""}
                    onChange={(e) => handleInputChange(question.key, e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select an option...</option>
                    {question.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {question.type === "checkbox" && (
                  <div className="space-y-2">
                    {question.options?.map((opt) => (
                      <label key={opt} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={(formData[question.key] || []).includes(opt)}
                          onChange={(e) => {
                            const current = formData[question.key] || [];
                            const updated = e.target.checked
                              ? [...current, opt]
                              : current.filter((item: string) => item !== opt);
                            handleInputChange(question.key, updated);
                          }}
                          className="h-4 w-4 rounded border-input"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={isFirstPage || loading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {isLastPage ? "Complete" : "Next"}
            {!isLastPage && <ChevronRight className="h-4 w-4" />}
            {loading && <Loader className="h-4 w-4 animate-spin" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function mapFormToInterviewData(formData: Record<string, unknown>) {
  const parseList = (value?: string) =>
    value
      ? value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined;

  const dataCollected = formData.data_collected;
  const dataCollectedValue = typeof dataCollected === "string" ? dataCollected : undefined;
  const returnDriversValue = Array.isArray(formData.return_drivers)
    ? formData.return_drivers
    : undefined;
  const discoveryChannelsValue = Array.isArray(formData.discovery_channels)
    ? formData.discovery_channels
    : undefined;
  const growthMechanismsValue = Array.isArray(formData.growth_mechanisms)
    ? formData.growth_mechanisms
    : undefined;
  const churnReasonsValue = Array.isArray(formData.churn_reasons)
    ? formData.churn_reasons
    : undefined;

  return {
    productType: formData.product_type,
    description: formData.product_description,
    problem: formData.problem_solved,
    userType: formData.user_type,
    experienceLevel: formData.experience_level,
    painPoint: formData.pain_point,
    discoveryChannels: discoveryChannelsValue,
    firstAction: formData.first_action,
    signupInfo: Array.isArray(formData.data_collected)
      ? formData.data_collected
      : parseList(dataCollectedValue),
    primaryAction: formData.primary_action,
    usageFrequency: formData.usage_frequency,
    returnDrivers: returnDriversValue,
    revenueModel: formData.revenue_model,
    upgradeTrigger: formData.upgrade_trigger,
    priceRange: formData.price_range,
    successDefinition: formData.success_definition,
    growthMechanisms: growthMechanismsValue,
    churnReasons: churnReasonsValue,
  };
}
