import { describe, it, expect } from 'vitest';
import { generateMermaid } from './generator';
import { WorkflowNode, WorkflowEdge } from '../types';

describe('Mermaid Generator', () => {
  it('should generate basic graph', () => {
    const nodes: WorkflowNode[] = [
      { id: 'A', data: { label: 'Start' }, position: { x: 0, y: 0 } },
      { id: 'B', data: { label: 'End' }, position: { x: 0, y: 0 } }
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1', source: 'A', target: 'B' }
    ];

    const output = generateMermaid(nodes, edges);
    expect(output).toContain('graph TD');
    expect(output).toContain('A["Start"]');
    expect(output).toContain('B["End"]');
    expect(output).toContain('A --> B');
  });

  it('should include edge labels', () => {
    const nodes: WorkflowNode[] = [
      { id: 'A', data: { label: 'A' }, position: { x: 0, y: 0 } },
      { id: 'B', data: { label: 'B' }, position: { x: 0, y: 0 } }
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1', source: 'A', target: 'B', label: 'Go' }
    ];

    const output = generateMermaid(nodes, edges);
    expect(output).toContain('A -->|"Go"| B');
  });
});
