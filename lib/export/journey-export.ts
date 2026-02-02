/**
 * Export Journey to Mermaid Diagram Format
 * 
 * Why: Users need to share and visualize journeys in different formats
 * What: Converts journey nodes/connections to Mermaid syntax
 * How: Maps node types to Mermaid shapes, handles conditional routing
 */

import { toPng } from 'html-to-image';

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

export function generateMermaidDiagram(
  nodes: ExportNode[],
  edges: ExportEdge[]
): string {
  let mermaid = "graph TD\n";

  // Map node types to Mermaid shapes
  const shapeMap: Record<string, { start: string; end: string }> = {
    JOURNEY_START: { start: "([", end: "])" }, // Stadium - beginning
    ONBOARDING_STEP: { start: "[", end: "]" }, // Rectangle - process
    DECISION_POINT: { start: "{", end: "}" }, // Diamond - decision
    ACTION: { start: "[", end: "]" }, // Rectangle
    INTERVENTION: { start: "[", end: "]" }, // Rectangle with special icon
    CONVERSION: { start: "[[", end: "]]" }, // Subroutine shape - important
    MILESTONE: { start: "(", end: ")" }, // Circle - milestone
    TOUCHPOINT: { start: "[", end: "]" }, // Rectangle
    JOURNEY_END: { start: "([", end: "])" }, // Stadium - end
  };

  // Add nodes
  nodes.forEach((node) => {
    const shape = shapeMap[node.data.type] || { start: "[", end: "]" };
    const label = node.data.label.replace(/\n/g, " ");
    mermaid += `  ${node.id}${shape.start}${label}${shape.end}\n`;
  });

  mermaid += "\n";

  // Add edges with labels for conditional routing
  edges.forEach((edge) => {
    const label = edge.label
      ? ` |${edge.label}|`
      : "";
    mermaid += `  ${edge.source} ${label}--> ${edge.target}\n`;
  });

  // Add styling
  mermaid += `
  
  style JOURNEY_START fill:#dcfce7,stroke:#22c55e,stroke-width:2px
  style JOURNEY_END fill:#fee2e2,stroke:#ef4444,stroke-width:2px
  style DECISION_POINT fill:#f3e8ff,stroke:#a855f7,stroke-width:2px
  style CONVERSION fill:#cffafe,stroke:#06b6d4,stroke-width:2px
  style MILESTONE fill:#fef3c7,stroke:#eab308,stroke-width:2px
  `;

  return mermaid;
}

/**
 * Generate JSON export
 * Why: API integrations, data portability, backups
 */
export function generateJSONExport(
  journeyId: string,
  nodes: ExportNode[],
  edges: ExportEdge[],
  metadata?: Record<string, unknown>
) {
  return {
    version: "1.0",
    journeyId,
    exportedAt: new Date().toISOString(),
    metadata,
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.data.type,
      label: n.data.label,
      description: n.data.description,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
    })),
  };
}

/**
 * Generate CSV export
 * Why: Import into spreadsheets, analysis
 */
export function generateCSVExport(
  nodes: ExportNode[],
  edges: ExportEdge[]
): string {
  // Nodes CSV
  let csv = "id,type,label,description\n";
  nodes.forEach((node) => {
    const desc = (node.data.description || "")
      .replace(/"/g, '""')
      .replace(/\n/g, " ");
    csv += `"${node.id}","${node.data.type}","${node.data.label}","${desc}"\n`;
  });

  csv += "\n\nConnections\n";
  csv += "source,target,label\n";
  edges.forEach((edge) => {
    csv += `"${edge.source}","${edge.target}","${edge.label || ""}"\n`;
  });

  return csv;
}

/**
 * Generate SVG diagram (using Mermaid's renderer)
 * Why: Share as image, embed in documents
 * Note: Requires mermaid CLI or server-side rendering
 */
export async function generateSVGExport(
  nodes: ExportNode[],
  edges: ExportEdge[]
): Promise<string> {
  // This would require server-side mermaid rendering
  // For now, return instruction to use mermaid online
  const mermaidCode = generateMermaidDiagram(nodes, edges);
  return `Mermaid diagram (visit https://mermaid.live and paste):\n\n${mermaidCode}`;
}

// Download helper functions
export function downloadMermaid(
  journeyName: string,
  mermaidCode: string
) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(mermaidCode)
  );
  element.setAttribute("download", `${journeyName}.mmd`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function downloadJSON(
  journeyName: string,
  data: object
) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2))
  );
  element.setAttribute("download", `${journeyName}.json`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function downloadCSV(
  journeyName: string,
  csvContent: string
) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
  );
  element.setAttribute("download", `${journeyName}.csv`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export async function downloadPNG(journeyName: string) {
  const element = document.querySelector('.react-flow__viewport') as HTMLElement;
  if (!element) {
    console.error("ReactFlow viewport not found");
    return;
  }

  try {
    await toPng(element, {
      backgroundColor: '#ffffff',
      style: {
        transform: 'translate(0, 0) scale(1)', // Reset transform to capture viewport at current zoom.
      }
    });

    // Actually, capturing .react-flow__renderer (the whole standard container) usually works best for WYSIWYG
    const renderer = document.querySelector('.react-flow') as HTMLElement;
    const finalElement = renderer || element;

    // We use toPng from the library
    // We need to dynamically import it because this file might be imported in environments where 'html-to-image' causes issues if not careful?
    // No, standard import is fine.

    const resultUrl = await toPng(finalElement, {
      backgroundColor: '#fff',
    });

    const a = document.createElement('a');
    a.setAttribute('download', `${journeyName}.png`);
    a.setAttribute('href', resultUrl);
    a.click();
  } catch (err) {
    console.error("Failed to export PNG:", err);
  }
}
