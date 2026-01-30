import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Panel,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StrategicInsightsPanel } from "./strategic-insights-panel";
import {
  Save,
  Plus,
  ZoomIn,
  ZoomOut,
  Download,
  RotateCcw,
  Trash2,
  AlertCircle,
  FileJson,
  FileText,
  Lightbulb,
  Image
} from "lucide-react";
import {
  generateMermaidDiagram,
  generateJSONExport,
  generateCSVExport,
  downloadMermaid,
  downloadJSON,
  downloadCSV,
  downloadPNG,
} from "@/lib/export/journey-export";

// Import custom node types (we'll create these next)
import { JourneyStartNode } from "./journey-nodes/journey-start-node";
import { OnboardingStepNode } from "./journey-nodes/onboarding-step-node";
import { DecisionPointNode } from "./journey-nodes/decision-point-node";
import { ConversionNode } from "./journey-nodes/conversion-node";
import { MilestoneNode } from "./journey-nodes/milestone-node";
import { ExitPointNode } from "./journey-nodes/exit-point-node";
import { ActionNode } from "./journey-nodes/action-node";
import { InterventionNode } from "./journey-nodes/intervention-node";
import { TouchpointNode } from "./journey-nodes/touchpoint-node";

interface JourneyEditorProps {
  journeyId: string;
}

interface ExportNode {
  id: string;
  data: {
    label: string;
    type: string;
    description?: string;
  };
}

interface ExportEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
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
  swimlaneHeader: SwimlaneHeaderNode,
};

const SWIMLANES = [
  { key: "ACQUISITION", label: "🎯 Acquisition", y: 0, color: "#10B981" },
  { key: "ACTIVATION", label: "⚡ Activation", y: 250, color: "#3B82F6" },
  { key: "RETENTION", label: "🔄 Retention", y: 500, color: "#8B5CF6" },
  { key: "MONETIZATION", label: "💰 Monetization", y: 750, color: "#F59E0B" },
  { key: "REFERRAL", label: "🚀 Referral", y: 1000, color: "#EF4444" },
];

function SwimlaneHeaderNode({ data }: { data: { label: string; color: string } }) {
  return (
    <div
      className="px-3 py-2 rounded-full text-xs font-semibold shadow-sm border"
      style={{
        borderColor: data.color,
        backgroundColor: `${data.color}20`,
        color: data.color,
      }}
    >
      {data.label}
    </div>
  );
}

export function JourneyEditor({ journeyId }: JourneyEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  // Fetch journey data
  const { data: journey, isLoading } = trpc.journey.getById.useQuery(
    { id: journeyId },
    { enabled: !!journeyId }
  );

  // Save mutation
  const saveJourney = trpc.journey.saveNodes.useMutation({
    onSuccess: () => {
      setSaving(false);
      setError(null);
    },
    onError: (err) => {
      setSaving(false);
      setError("Failed to save journey");
    },
  });

  // Initialize nodes and edges from journey data
  useEffect(() => {
    if (journey?.nodes && journey?.connections) {
      const swimlaneNodes: Node[] = SWIMLANES.map((lane) => ({
        id: `swimlane-${lane.key}`,
        type: "swimlaneHeader",
        data: { label: lane.label, color: lane.color, isSwimlane: true },
        position: { x: -260, y: lane.y - 40 },
        draggable: false,
        selectable: false,
        connectable: false,
        focusable: false,
      }));

      const initialNodes: Node[] = journey.nodes.map((node: any) => ({
        id: node.id,
        data: {
          label: node.label,
          description: node.description,
          type: node.type,
          stage: node.stage,
        },
        position: {
          x: node.positionX || 0,
          y: node.positionY || 0,
        },
        type: getNodeTypeFromType(node.type),
      }));

      const initialEdges: Edge[] = journey.connections.map((conn: any) => ({
        id: conn.id,
        source: conn.sourceId,
        target: conn.targetId,
        label: conn.label || undefined,
        animated: true,
      }));

      setNodes([...swimlaneNodes, ...initialNodes]);
      setEdges(initialEdges);
    }
  }, [journey?.nodes, journey?.connections, setNodes, setEdges]);

  // Handle new connection
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // Handle save
  const handleSave = async () => {
    if (!journeyId || saveJourney.isPending) return;

    setSaving(true);
    try {
      await saveJourney.mutateAsync({
        journeyId,
        nodes: nodes
          .filter((node) => node.type !== "swimlaneHeader")
          .map((node) => ({
            id: node.id,
            type: node.data.type || "ACTION",
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
          label: edge.label as string | undefined,
          type: edge.animated ? "default" : "step",
        })),
      });
    } catch (err) {
      setError("Failed to save journey");
    }
  };

  // Add a new node
  const addNode = (type: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      data: {
        label: `New ${type}`,
        type,
      },
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      type: getNodeTypeFromType(type),
    };
    setNodes((nds) => [...nds, newNode]);
    setShowNodeMenu(false);
  };

  const deleteSelectedNodes = () => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !nodes
            .filter((n) => n.selected)
            .map((n) => n.id)
            .includes(edge.source) &&
          !nodes
            .filter((n) => n.selected)
            .map((n) => n.id)
            .includes(edge.target)
      )
    );
  };

  const handleExport = (format: "mermaid" | "json" | "csv" | "png") => {
    const journeyName = journey?.title || "journey";

    switch (format) {
      case "mermaid":
        const mermaidCode = generateMermaidDiagram(
          nodes as ExportNode[],
          edges as ExportEdge[]
        );
        downloadMermaid(journeyName, mermaidCode);
        break;
      case "json":
        const jsonData = generateJSONExport(
          journeyId,
          nodes as ExportNode[],
          edges as ExportEdge[],
          { title: journey?.title, description: journey?.description }
        );
        downloadJSON(journeyName, jsonData);
        break;
      case "csv":
        const csvData = generateCSVExport(
          nodes as ExportNode[],
          edges as ExportEdge[]
        );
        downloadCSV(journeyName, csvData);
        break;
      case "png":
        downloadPNG(journeyName);
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600 mx-auto" />
          <p className="text-muted-foreground">Loading journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex">
      {/* Error banner */}
      {error && (
        <div className="absolute left-0 right-0 top-0 z-50 flex items-center gap-2 bg-red-50 px-4 py-3 text-sm text-red-700 border-b border-red-200">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* ReactFlow Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />

          {/* Top Toolbar - Apple Design Applied */}
          <Panel position="top-left" className="flex gap-3">
            <Card className="p-3 flex gap-2 bg-white/95 backdrop-blur-sm border-slate-200 shadow-md">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                onClick={() => setShowNodeMenu(!showNodeMenu)}
                title="Add new node"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white font-medium"
                onClick={handleSave}
                disabled={saving}
                title="Save changes"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
              <div className="w-px bg-slate-200"></div>
              <Button
                size="sm"
                variant="outline"
                onClick={deleteSelectedNodes}
                title="Delete selected nodes"
                className="border-slate-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>

            {/* Export Menu */}
            <Card className="p-3 flex gap-2 bg-white/95 backdrop-blur-sm border-slate-200 shadow-md">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport("mermaid")}
                title="Export as Mermaid diagram"
                className="border-slate-300"
              >
                <FileText className="h-4 w-4 mr-1" />
                Mermaid
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport("json")}
                title="Export as JSON"
                className="border-slate-300"
              >
                <FileJson className="h-4 w-4 mr-1" />
                JSON
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport("csv")}
                title="Export as CSV"
                className="border-slate-300"
              >
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport("png")}
                title="Download as PNG Image"
                className="border-slate-300"
              >
                <Image className="h-4 w-4 mr-1" />
                PNG
              </Button>
            </Card>

          </Panel>

          {/* Insights Toggle Button - Top Right */}
          <Panel position="top-right">
            <Card className="p-3 bg-white/95 backdrop-blur-sm border-slate-200 shadow-md">
              <Button
                size="sm"
                className={`transition-all ${showInsights
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                variant="outline"
                onClick={() => setShowInsights(!showInsights)}
                title="Toggle strategic insights panel"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {showInsights ? "Hide" : "Show"} Insights
              </Button>
            </Card>
          </Panel>

          {/* Node Type Menu */}
          {showNodeMenu && (
            <Panel position="top-center" className="w-auto">
              <Card className="p-4">
                <p className="text-sm font-semibold mb-3">Add Node</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNode("JOURNEY_START")}
                    className="text-xs"
                  >
                    🚀 Start
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNode("ONBOARDING_STEP")}
                    className="text-xs"
                  >
                    📋 Step
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNode("DECISION_POINT")}
                    className="text-xs"
                  >
                    🔀 Decision
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNode("ACTION")}
                    className="text-xs"
                  >
                    ⚡ Action
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNode("INTERVENTION")}
                    className="text-xs"
                  >
                    🤝 Intervention
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNode("CONVERSION")}
                    className="text-xs"
                  >
                    💰 Conversion
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNode("MILESTONE")}
                    className="text-xs"
                  >
                    🏁 Milestone
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNode("TOUCHPOINT")}
                    className="text-xs"
                  >
                    📍 Touchpoint
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNode("JOURNEY_END")}
                    className="text-xs"
                  >
                    🏁 End
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNodeMenu(false)}
                  className="w-full mt-3 text-xs"
                >
                  Close
                </Button>
              </Card>
            </Panel>
          )}

          {/* Bottom Info Panel */}
          <Panel position="bottom-left">
            <Card className="p-3 text-xs text-muted-foreground max-w-xs bg-white/95 backdrop-blur-sm border-slate-200">
              <p className="font-semibold mb-2">Journey Information</p>
              <p>📊 Nodes: {nodes.length}</p>
              <p>🔗 Connections: {edges.length}</p>
              <p className="mt-2 text-xs opacity-70">
                Drag to move • Delete to remove • Ctrl+Click to select multiple
              </p>
            </Card>
          </Panel>
        </ReactFlow>
      </div>

      {/* Strategic Insights Sidebar - Collapsible */}
      <div
        className={`transition-all duration-300 ease-out overflow-hidden ${showInsights ? "w-80" : "w-0"
          }`}
      >
        {showInsights && (
          <StrategicInsightsPanel
            journeyId={journeyId}
            nodes={nodes.filter((n) => n.type !== "swimlaneHeader")}
            onClose={() => setShowInsights(false)}
          />
        )}
      </div>
    </div>
  );
}

function getNodeTypeFromType(type: string): string {
  const mapping: Record<string, string> = {
    JOURNEY_START: "journeyStart",
    ONBOARDING_STEP: "onboardingStep",
    DECISION_POINT: "decisionPoint",
    CONVERSION: "conversion",
    MILESTONE: "milestone",
    JOURNEY_END: "exitPoint",
    ACTION: "action",
    INTERVENTION: "intervention",
    TOUCHPOINT: "touchpoint",
  };
  return mapping[type] || "action";
}
