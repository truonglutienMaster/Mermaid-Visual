import { WorkflowNode, WorkflowEdge } from '../types';
import { createEdgeId } from '../utils/id';

export interface ParsedGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  direction: string;
}

export const parseMermaid = (code: string): ParsedGraph => {
  const nodes: Map<string, WorkflowNode> = new Map();
  const edges: WorkflowEdge[] = [];
  let direction = 'TD';

  const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('%%'));

  lines.forEach(line => {
    // Parse Direction
    if (line.match(/^(graph|flowchart)\s+(TD|BT|LR|RL)/)) {
      const match = line.match(/^(graph|flowchart)\s+(TD|BT|LR|RL)/);
      if (match) direction = match[2];
      return;
    }

    // Edges: A --> B, A -->|label| B
    if (line.includes('-->')) {
      const parts = line.split('-->');
      if (parts.length >= 2) {
        let sourceRaw = parts[0].trim();
        // Handle multi-segment edges A --> B --> C
        // For MVP, we'll iterate pairs. A-->B, B-->C is tricky if on one line without splitting logic properly.
        // Assuming simplier parser for now: one edge per line or chained simple edges.

        // Actually, let's process the whole line as a chain if needed.
        // But first, let's extract nodes from the raw strings like 'A[Label]' or 'B'

        const segments = line.split('-->').map(s => s.trim());

        for (let i = 0; i < segments.length - 1; i++) {
          const sourceStr = segments[i];
          const targetStr = segments[i+1];

          // Check for edge label in targetStr: |Label| B
          let edgeLabel: string | undefined = undefined;
          let realTargetStr = targetStr;

          if (targetStr.startsWith('|')) {
             const labelMatch = targetStr.match(/^\|(.*?)\|(.*)/);
             if (labelMatch) {
               edgeLabel = labelMatch[1];
               realTargetStr = labelMatch[2].trim();
             }
          }

          const sourceNode = parseNodeString(sourceStr);
          const targetNode = parseNodeString(realTargetStr);

          if (!sourceNode.id || !targetNode.id) {
             throw new Error('Invalid edge definition: Missing node ID');
          }

          // Add nodes if not exist (merge/update if label provided)
          if (!nodes.has(sourceNode.id) || (sourceNode.label !== sourceNode.id && nodes.get(sourceNode.id)?.data.label === sourceNode.id)) {
             nodes.set(sourceNode.id, { ...sourceNode, position: { x: 0, y: 0 } });
          }
          if (!nodes.has(targetNode.id) || (targetNode.label !== targetNode.id && nodes.get(targetNode.id)?.data.label === targetNode.id)) {
             nodes.set(targetNode.id, { ...targetNode, position: { x: 0, y: 0 } });
          }

          edges.push({
            id: createEdgeId(sourceNode.id, targetNode.id),
            source: sourceNode.id,
            target: targetNode.id,
            label: edgeLabel
          });
        }
      }
      return;
    }

    // Single Node definition: A[Label] or A
    const node = parseNodeString(line);
    if (node.id) {
       if (!nodes.has(node.id) || (node.label !== node.id)) {
           nodes.set(node.id, { ...node, position: { x: 0, y: 0 } });
       }
    }
  });

  return {
    nodes: Array.from(nodes.values()),
    edges,
    direction
  };
};

// Helper to parse "A", "A[Label]", "A(Label)"
const parseNodeString = (str: string): { id: string; data: { label: string } } => {
  // Check for brackets
  const squareMatch = str.match(/^([a-zA-Z0-9_]+)\[(.*?)\]$/);
  if (squareMatch) {
    let label = squareMatch[2];
    // Remove quotes if present
    if (label.startsWith('"') && label.endsWith('"')) {
      label = label.slice(1, -1);
    }
    return { id: squareMatch[1], data: { label } };
  }

  const roundMatch = str.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/);
  if (roundMatch) {
    return { id: roundMatch[1], data: { label: roundMatch[2] } };
  }

  // Fallback: use whole string as ID and Label
  // Clean up potential trailing chars if mixed in complex syntax (not handled in MVP)
  const id = str.split(' ')[0];
  return { id: id, data: { label: id } };
};
