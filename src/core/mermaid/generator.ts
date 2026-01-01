import { WorkflowNode, WorkflowEdge } from '../types';

export const generateMermaid = (nodes: WorkflowNode[], edges: WorkflowEdge[], direction = 'TD'): string => {
  const lines: string[] = [`graph ${direction}`];

  // Helper to escape label if necessary (basic)
  const formatLabel = (id: string, label: string) => {
    if (id === label) return id;
    // Prefer brackets [ ]
    // Escape " if needed, but for MVP assuming simple text
    return `${id}["${label}"]`;
  };

  // We should output all nodes that are not just inferred from edges
  // Or just output all nodes definitions first to be safe and keep labels
  nodes.forEach(node => {
    lines.push(formatLabel(node.id, node.data.label));
  });

  edges.forEach(edge => {
    if (edge.label) {
      lines.push(`${edge.source} -->|"${edge.label}"| ${edge.target}`);
    } else {
      lines.push(`${edge.source} --> ${edge.target}`);
    }
  });

  return lines.join('\n');
};
