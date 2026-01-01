import { describe, it, expect } from 'vitest';
import { applyAutoLayout } from './engine';
import { WorkflowNode, WorkflowEdge } from '../types';

describe('Layout Engine', () => {
  it('should assign positions to nodes', () => {
    const nodes: WorkflowNode[] = [
      { id: '1', data: { label: '1' }, position: { x: 0, y: 0 } },
      { id: '2', data: { label: '2' }, position: { x: 0, y: 0 } },
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1-2', source: '1', target: '2' }
    ];

    const result = applyAutoLayout(nodes, edges, 'TD');

    expect(result.nodes[0].position.x).toBeDefined();
    expect(result.nodes[0].position.y).toBeDefined();
    // Node 1 should be above Node 2 in TD
    expect(result.nodes[1].position.y).toBeGreaterThan(result.nodes[0].position.y);
  });
});
