"use client";

import { useState } from "react";
import { AIChatInterview } from "@/features/interview/ai-chat-interview";
import { ControlledJourneyEditor } from "@/features/journey-editor/components/controlled-journey-editor";
import { useNodesState, useEdgesState, Connection, addEdge, Node, Edge } from "reactflow";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";

export default function LiveJourneyPage() {
    const params = useParams();
    const journeyId = params.journeyId as string;
    const router = useRouter();

    // Lifted State for ReactFlow
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Handler for partial updates from the Chat Interview
    const handlePartialUpdate = (newNodes: Node[], newEdges: Edge[]) => {
        setNodes((nds) => {
            const existingIds = new Set(nds.map((n) => n.id));
            const uniqueNewNodes = newNodes.filter((n) => !existingIds.has(n.id));

            // If we wanted to update existing nodes, we'd map through nds and merge. 
            // For now, let's just add new ones to avoid overwrites unless intended.
            return [...nds, ...uniqueNewNodes];
        });

        setEdges((eds) => {
            const existingIds = new Set(eds.map((e) => e.id));
            const uniqueNewEdges = newEdges.filter((e) => !existingIds.has(e.id));
            return [...eds, ...uniqueNewEdges];
        });
    };

    const handleConnection = (connection: Connection) => {
        setEdges((eds) => addEdge(connection, eds));
    };

    // Mutation to save the journey
    const saveJourney = trpc.journey.saveNodes.useMutation();

    const handleComplete = async (data: any) => {
        try {
            // Save the AI-generated nodes/edges to the database
            await saveJourney.mutateAsync({
                journeyId,
                nodes: nodes.map((node) => ({
                    id: node.id,
                    type: node.data.type || "ACTION", // providing default type if missing
                    label: node.data.label || "Step",
                    description: node.data.description,
                    positionX: node.position.x,
                    positionY: node.position.y,
                    data: node.data,
                    stage: node.data.stage,
                })),
                connections: edges.map((edge) => ({
                    id: edge.id,
                    sourceId: edge.source,
                    targetId: edge.target,
                    label: edge.label as string | undefined, // explicitly casting
                    type: edge.animated ? "default" : "step",
                })),
            });

            // Redirect to full editor
            router.push(`/journey/${journeyId}/editor`);
        } catch (error) {
            console.error("Failed to save journey:", error);
            // Optionally show error toast here
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Left Panel: The Strategist (Chat) */}
            <div className="w-[450px] flex-shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur-xl z-20 shadow-2xl flex flex-col transition-all duration-300 ease-in-out">
                <AIChatInterview
                    journeyId={journeyId}
                    onComplete={handleComplete}
                    onPartialUpdate={handlePartialUpdate}
                />
            </div>

            {/* Right Panel: The Visualization (Canvas) */}
            <div className="flex-1 relative bg-slate-50 overflow-hidden">
                {/* Subtle Grid Pattern Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Gradient Blobs for premium feel */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-[100px] mix-blend-multiply filter opacity-70 animate-blob"></div>
                    <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-blue-200/30 blur-[100px] mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative h-full w-full z-10">
                    <ControlledJourneyEditor
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={handleConnection}
                    />
                </div>
            </div>
        </div>
    );
}
