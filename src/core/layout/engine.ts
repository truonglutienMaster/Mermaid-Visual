import dagre from 'dagre';
import { WorkflowNode, WorkflowEdge } from '../types';

export const applyAutoLayout = (nodes: WorkflowNode[], edges: WorkflowEdge[], direction = 'TD'): { nodes: WorkflowNode[], edges: WorkflowEdge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR' || direction === 'RL';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    // We need to assume a width/height for the layout if not rendered yet.
    // Standard node size approximation.
    dagreGraph.setNode(node.id, { width: 150, height: 50 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      // We are shifting the dagre node position (center-based) to React Flow (top-left based)
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
