import { describe, it, expect } from 'vitest';
import { parseMermaid } from './parser';

describe('Mermaid Parser', () => {
  it('should parse basic graph direction', () => {
    const code = 'graph LR';
    const result = parseMermaid(code);
    expect(result.direction).toBe('LR');
  });

  it('should parse nodes with labels', () => {
    const code = `
    graph TD
    A[Start]
    B(End)
    C
    `;
    const result = parseMermaid(code);
    expect(result.nodes).toHaveLength(3);
    expect(result.nodes.find(n => n.id === 'A')?.data.label).toBe('Start');
    expect(result.nodes.find(n => n.id === 'B')?.data.label).toBe('End');
    expect(result.nodes.find(n => n.id === 'C')?.data.label).toBe('C');
  });

  it('should parse simple edges', () => {
    const code = `
    graph TD
    A --> B
    `;
    const result = parseMermaid(code);
    expect(result.edges).toHaveLength(1);
    expect(result.edges[0].source).toBe('A');
    expect(result.edges[0].target).toBe('B');
  });

  it('should parse edges with labels', () => {
    const code = `
    graph TD
    A -->|Go| B
    `;
    const result = parseMermaid(code);
    expect(result.edges[0].label).toBe('Go');
  });

  it('should parse chained edges', () => {
    const code = `
    graph TD
    A --> B --> C
    `;
    const result = parseMermaid(code);
    expect(result.edges).toHaveLength(2);
    expect(result.edges.find(e => e.source === 'A' && e.target === 'B')).toBeTruthy();
    expect(result.edges.find(e => e.source === 'B' && e.target === 'C')).toBeTruthy();
  });

  it('should handle node definitions mixed with edges', () => {
     const code = `
     graph TD
     A[Start] --> B
     B --> C(End)
     `;
     const result = parseMermaid(code);
     expect(result.nodes.find(n => n.id === 'A')?.data.label).toBe('Start');
     expect(result.nodes.find(n => n.id === 'C')?.data.label).toBe('End');
     expect(result.edges).toHaveLength(2);
  });
});
