import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
    Node,
    Edge,
    addEdge,
    Connection,
    OnNodesChange,
    OnEdgesChange,
    Background,
    Controls,
    Panel,
    MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ZoomIn,
    ZoomOut,
    Download,
} from "lucide-react";

// Import custom node types
import { JourneyStartNode } from "./journey-nodes/journey-start-node";
import { OnboardingStepNode } from "./journey-nodes/onboarding-step-node";
import { DecisionPointNode } from "./journey-nodes/decision-point-node";
import { ConversionNode } from "./journey-nodes/conversion-node";
import { MilestoneNode } from "./journey-nodes/milestone-node";
import { ExitPointNode } from "./journey-nodes/exit-point-node";
import { ActionNode } from "./journey-nodes/action-node";
import { InterventionNode } from "./journey-nodes/intervention-node";
import { TouchpointNode } from "./journey-nodes/touchpoint-node";

interface ControlledJourneyEditorProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect?: (connection: Connection) => void;
}

const nodeTypes = {
    journeyStart: JourneyStartNode,
    onboardingStep: OnboardingStepNode,
    decisionPoint: DecisionPointNode,
    conversion: ConversionNode,
    milestone: MilestoneNode,
    exitPoint: ExitPointNode,
    action: ActionNode,
    intervention: InterventionNode,
    touchpoint: TouchpointNode,
};

export function ControlledJourneyEditor({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect
}: ControlledJourneyEditorProps) {

    return (
        <div className="relative h-full w-full bg-gray-50/50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-right"
            >
                <Background gap={12} size={1} />
                <Controls />
                <MiniMap />

                {/* Overlay for "Live Construction" effect */}
                <Panel position="top-right">
                    <Card className="p-2 bg-white/90 backdrop-blur border-blue-100 shadow-sm">
                        <div className="text-xs text-blue-600 font-medium flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Live Strategy Map
                        </div>
                    </Card>
                </Panel>
            </ReactFlow>
        </div>
    );
}
