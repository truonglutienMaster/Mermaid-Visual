export interface WorkflowNode {
  id: string;
  type?: string;
  data: {
    label: string;
    [key: string]: any;
  };
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  animated?: boolean;
}
