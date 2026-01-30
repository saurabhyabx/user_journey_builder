/**
 * Version Control System for Journeys
 * 
 * Why: Users need to track changes, rollback to previous states, see what changed
 * What: Auto-snapshots, restore capability, version history
 * How: Store journey state (nodes + edges) as JSON snapshots
 */

import { Node, Edge } from "reactflow";

export interface JourneySnapshot {
  id: string;
  journeyId: string;
  version: number;
  name?: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
  createdBy: string;
}

/**
 * Create a snapshot of current journey state
 * Use case: Auto-save on changes, manual save points
 */
export function createSnapshot(
  journeyId: string,
  nodes: Node[],
  edges: Edge[],
  options?: {
    name?: string;
    description?: string;
    version?: number;
    createdBy?: string;
  }
): Partial<JourneySnapshot> {
  return {
    journeyId,
    version: options?.version || 1,
    name: options?.name,
    description: options?.description,
    nodes,
    edges,
    createdAt: new Date(),
    createdBy: options?.createdBy || "unknown",
  };
}

/**
 * Calculate diff between two snapshots
 * Show user what changed between versions
 */
export function diffSnapshots(
  previous: JourneySnapshot,
  current: JourneySnapshot
): {
  nodesAdded: Node[];
  nodesDeleted: Node[];
  nodesModified: Array<{ previous: Node; current: Node }>;
  edgesAdded: Edge[];
  edgesDeleted: Edge[];
} {
  const nodesAdded = current.nodes.filter(
    (n) => !previous.nodes.find((p) => p.id === n.id)
  );

  const nodesDeleted = previous.nodes.filter(
    (p) => !current.nodes.find((n) => n.id === p.id)
  );

  const nodesModified = current.nodes
    .filter((n) => previous.nodes.find((p) => p.id === n.id))
    .filter((n) => {
      const prev = previous.nodes.find((p) => p.id === n.id)!;
      return JSON.stringify(prev) !== JSON.stringify(n);
    })
    .map((n) => ({
      previous: previous.nodes.find((p) => p.id === n.id)!,
      current: n,
    }));

  const edgesAdded = current.edges.filter(
    (e) => !previous.edges.find((p) => p.id === e.id)
  );

  const edgesDeleted = previous.edges.filter(
    (p) => !current.edges.find((e) => e.id === p.id)
  );

  return {
    nodesAdded,
    nodesDeleted,
    nodesModified,
    edgesAdded,
    edgesDeleted,
  };
}

/**
 * Generate a human-readable summary of changes
 */
export function summarizeChanges(diff: ReturnType<typeof diffSnapshots>): string {
  const changes: string[] = [];

  if (diff.nodesAdded.length > 0) {
    changes.push(`Added ${diff.nodesAdded.length} node(s)`);
  }
  if (diff.nodesDeleted.length > 0) {
    changes.push(`Removed ${diff.nodesDeleted.length} node(s)`);
  }
  if (diff.nodesModified.length > 0) {
    changes.push(`Modified ${diff.nodesModified.length} node(s)`);
  }
  if (diff.edgesAdded.length > 0) {
    changes.push(`Added ${diff.edgesAdded.length} connection(s)`);
  }
  if (diff.edgesDeleted.length > 0) {
    changes.push(`Removed ${diff.edgesDeleted.length} connection(s)`);
  }

  return changes.join(" • ");
}
