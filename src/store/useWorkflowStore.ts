import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
} from '@xyflow/react';
import { temporal } from 'zundo';
import type { WorkflowNode, WorkflowEdge } from '../core/types';
import { parseMermaid } from '../core/mermaid/parser';
import { generateMermaid } from '../core/mermaid/generator';
import { applyAutoLayout } from '../core/layout/engine';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  mermaidCode: string;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setMermaidCode: (code: string) => void;
  importMermaid: () => void;
  exportMermaid: () => void;
  syncToMermaid: () => void; // Syncs current canvas to code
}

export const useWorkflowStore = create<WorkflowState>()(
  temporal((set, get) => ({
    nodes: [],
    edges: [],
    mermaidCode: 'graph TD\nA[Start] --> B[End]',
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection: Connection) => {
      set({
        edges: addEdge(connection, get().edges),
      });
    },
    setMermaidCode: (code: string) => {
      set({ mermaidCode: code });
    },
    importMermaid: () => {
      const { mermaidCode } = get();
      try {
        const { nodes, edges, direction } = parseMermaid(mermaidCode);
        const layouted = applyAutoLayout(nodes, edges, direction);

        // Convert to React Flow format
        const rfNodes: Node[] = layouted.nodes.map(n => ({
          id: n.id,
          type: 'default', // Using default for now
          data: { label: n.data.label },
          position: n.position,
        }));

        const rfEdges: Edge[] = layouted.edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          type: 'default' // or smoothstep
        }));

        set({ nodes: rfNodes, edges: rfEdges });
      } catch (e) {
        console.error('Failed to import mermaid', e);
        // In real app, set error state
        throw e;
      }
    },
    exportMermaid: () => {
       // Only updates the text, doesn't copy to clipboard (that's UI job)
       get().syncToMermaid();
    },
    syncToMermaid: () => {
      const { nodes, edges } = get();
      const wfNodes: WorkflowNode[] = nodes.map(n => ({
        id: n.id,
        data: { label: n.data.label as string },
        position: n.position
      }));

      const wfEdges: WorkflowEdge[] = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label as string | undefined
      }));

      const code = generateMermaid(wfNodes, wfEdges);
      set({ mermaidCode: code });
    }
  }))
);
