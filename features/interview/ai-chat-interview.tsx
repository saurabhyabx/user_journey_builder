"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Send, Loader } from "lucide-react";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
  metadata?: {
    category?: string;
    questionType?: string;
    options?: Array<{ value: string; label: string }>;
  };
}

interface AIChatInterviewProps {
  journeyId: string;
  onComplete: (data: Record<string, any>) => void;
  onPartialUpdate?: (nodes: any[], edges: any[]) => void;
}

export function AIChatInterview({ journeyId, onComplete, onPartialUpdate }: AIChatInterviewProps) {
  const analyze = trpc.journey.analyzeConversation.useMutation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const hasInitialized = useRef(false);

  const QUESTION_FLOW = [
    {
      id: "q1",
      key: "productType",
      content:
        "Let me help you discover something about your users you might not have considered yet. First, what are you building? (e.g., A fitness app for new moms)",
    },
    {
      id: "q2",
      key: "description",
      content:
        "Interesting! And in one sentence, what is the core value you promise them?",
    },
    {
      id: "q3",
      key: "problem",
      content: "What is the specific pain point that drives them to look for this solution?",
    },
    {
      id: "q4",
      key: "userType",
      content: "Who is this user exactly? Be specific about their mindset.",
    },
    {
      id: "q5",
      key: "discoveryChannels",
      content: "How do they find you? (Google, Social, Referrals?)",
    },
    {
      id: "q6",
      key: "primaryAction",
      content: "What is the FIRST 'Aha!' moment action they take in the app?",
    },
    // ... shortened for MVP
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start interview
  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const startMessage: Message = {
      id: `ai-start-${Date.now()}`,
      type: "ai",
      content:
        "Hi! I'm your AI Strategist. Let's map your user journey together. I'll visualize our conversation as we talk.",
    };
    setMessages([startMessage]);

    // Ask first question after delay
    setTimeout(() => {
      const firstQuestion = QUESTION_FLOW[0];
      const firstMessage: Message = {
        id: `ai-q-0-${Date.now()}`,
        type: "ai",
        content: firstQuestion.content,
      };
      setMessages((prev) => [...prev, firstMessage]);
    }, 1000);
  }, []);

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    
    // Validate input is not empty
    if (!trimmedInput) return;
    
    // Validate minimum length (at least 3 characters)
    if (trimmedInput.length < 3) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          type: "ai",
          content: "Please provide a more detailed answer (at least 3 characters).",
        },
      ]);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: trimmedInput,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const current = QUESTION_FLOW[currentQuestion];
    const updatedData = {
      ...interviewData,
      [current.key]: trimmedInput,
    };
    setInterviewData(updatedData);

    // MAGICAL AI UPDATE: Send transcript to Claude
    try {
      const transcript = newMessages.map(m => ({
        role: m.type === "ai" ? "assistant" : "user" as "user" | "assistant",
        content: m.content
      }));

      const aiResult = await analyze.mutateAsync({
        journeyId,
        messages: transcript,
        currentStage: current.key
      });

      if (onPartialUpdate && aiResult.nodes && aiResult.nodes.length > 0) {
        onPartialUpdate(aiResult.nodes, aiResult.edges || []);
      }
    } catch (err) {
      console.error("AI Analysis failed, falling back to heuristics", err);
      if (onPartialUpdate) {
        const { nodes, edges } = generatePartialUpdate(current.key, trimmedInput, updatedData);
        onPartialUpdate(nodes, edges);
      }
    }

    // Simulate AI processing
    setTimeout(() => {
      if (currentQuestion < QUESTION_FLOW.length - 1) {
        const nextQuestion = QUESTION_FLOW[currentQuestion + 1];
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-q-${currentQuestion + 1}-${Date.now()}`,
            type: "ai",
            content: nextQuestion.content,
          },
        ]);
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Interview complete
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-processing-${Date.now()}`,
            type: "ai",
            content: "Connecting the dots & generating your strategic blueprint... ✨",
          },
        ]);

        // Smart Finalization: Re-generate full graph to ensure connectivity
        const fullGraphNodes: any[] = [];
        const fullGraphEdges: any[] = [];

        // Re-run heuristics for all keys
        Object.entries(updatedData).forEach(([k, v]) => {
          const { nodes: n, edges: e } = generatePartialUpdate(k, v as string, updatedData);
          fullGraphNodes.push(...n);
          fullGraphEdges.push(...e);
        });

        // Apply robust linking
        const finalGraph = finalizeJourney(fullGraphNodes, fullGraphEdges);

        if (onPartialUpdate) {
          onPartialUpdate(finalGraph.nodes, finalGraph.edges);
        }

        setTimeout(() => {
          onComplete(updatedData);
        }, 2000);
      }

      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col bg-transparent">
      {/* Header */}
      <div className="border-b border-slate-100 bg-white/50 px-6 py-5 backdrop-blur-sm">
        <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          AI Strategist
        </h1>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            {currentQuestion < 3 ? "Discovery Phase" : "Mapping Phase"}
          </p>
          <span className="text-xs font-mono text-slate-400">
            {Math.round(((currentQuestion + 1) / QUESTION_FLOW.length) * 100)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestion + 1) / QUESTION_FLOW.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-hide">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${message.type === "user"
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none shadow-blue-200"
                  : "bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-slate-200"
                  }`}
              >
                <p className={message.type === "ai" ? "font-medium" : ""}>{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 text-xs text-slate-500 bg-white/80 px-4 py-3 rounded-full shadow-sm border border-slate-100 backdrop-blur-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>Analyzing strategy...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-6 border-t border-slate-100">
        <div className="relative shadow-sm rounded-xl overflow-hidden ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your answer..."
            className="resize-none pr-14 min-h-[60px] max-h-[120px] bg-white border-none focus-visible:ring-0 text-slate-800 placeholder:text-slate-400 py-3 px-4"
            disabled={loading}
          />
          <div className="absolute right-2 bottom-2">
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              size="icon"
              className={`h-8 w-8 transition-all duration-200 ${input.trim()
                ? "bg-blue-600 hover:bg-blue-700 scale-100 opacity-100"
                : "bg-slate-100 text-slate-300 scale-90 opacity-70"
                }`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-center text-slate-400 font-medium">
          Press <span className="font-bold">Enter</span> to send • <span className="font-bold">Shift+Enter</span> for new line
        </p>
      </div>
    </div>
  );
}

// Heuristic Generator
function generatePartialUpdate(key: string, value: string, allData: any): { nodes: any[], edges: any[] } {
  const nodes: any[] = [];
  const edges: any[] = [];

  // Simple randomization for position to avoid overlap if called multiple times, 
  // but in a real app we'd calculate layout.
  const r = () => Math.random() * 50;

  if (key === "productType") {
    nodes.push({
      id: "start",
      type: "journeyStart",
      data: { label: "User Arrives", description: `Interested in ${value}`, type: "JOURNEY_START" },
      position: { x: 250, y: 50 },
    });
  }

  if (key === "description") {
    nodes.push({
      id: "value-prop",
      type: "milestone",
      data: { label: "Value Promise", description: value, stage: "AWARENESS", type: "MILESTONE" },
      position: { x: 250, y: 150 },
    });
    edges.push({ id: "e1", source: "start", target: "value-prop", animated: true });
  }

  if (key === "problem") {
    nodes.push({
      id: "problem",
      type: "action", // Using action as a placeholder for "Problem"
      data: { label: "Pain Point", description: value, type: "ACTION" },
      position: { x: 50, y: 150 },
    });
    edges.push({ id: "e2", source: "start", target: "problem", animated: true, label: "Trigger" });
  }

  if (key === "userType") {
    // Update the start node label if possible, or add a persona node
    nodes.push({
      id: "persona",
      type: "touchpoint",
      data: { label: "Persona", description: value, type: "TOUCHPOINT" },
      position: { x: 450, y: 50 },
    });
  }

  if (key === "primaryAction") {
    nodes.push({
      id: "core-action",
      type: "action",
      data: { label: "Core Action", description: value, type: "ACTION" },
      position: { x: 450, y: 150 },
    });
  }

  return { nodes, edges };
}

// Connects disconnected nodes into a cohesive story
function finalizeJourney(nodes: any[], edges: any[]): { nodes: any[], edges: any[] } {
  const newEdges = [...edges];
  const newNodes = [...nodes];

  // standard ID mapping from heuristic generation
  const hasNode = (id: string) => nodes.some(n => n.id === id);

  // 1. Discovery -> Start
  if (hasNode("channel") && hasNode("start")) {
    newEdges.push({ id: "e-channel-start", source: "channel", target: "start", type: "default", animated: true, label: "Acquisition" });
  }

  // 2. Start -> Problem (The Hook)
  if (hasNode("start") && hasNode("problem")) {
    newEdges.push({ id: "e-start-problem", source: "start", target: "problem", type: "default", animated: true });
  }

  // 3. Problem -> Value Prop (The Promise)
  if (hasNode("problem") && hasNode("value-prop")) {
    newEdges.push({ id: "e-problem-value", source: "problem", target: "value-prop", type: "default", animated: true });
  }

  // 4. Value Prop -> Core Action (The Aha Moment)
  if (hasNode("value-prop") && hasNode("core-action")) {
    newEdges.push({ id: "e-value-action", source: "value-prop", target: "core-action", type: "default", animated: true, label: "Onboarding" });
  }

  // 5. Add a "Success" node if we have a core action
  if (hasNode("core-action") && !hasNode("success")) {
    newNodes.push({
      id: "success",
      type: "conversion",
      data: { label: "User Success", description: "Values realized & retained", type: "CONVERSION" },
      position: { x: 650, y: 150 },
    });
    newEdges.push({ id: "e-action-success", source: "core-action", target: "success", type: "default", animated: true, label: "Retention" });
  }

  return { nodes: newNodes, edges: newEdges };
}
