import { describe, it, expect } from 'vitest';
import { parseMermaid } from './parser';
import { generateMermaid } from './generator';

describe('Round Trip', () => {
  it('should preserve structure after parse -> generate -> parse', () => {
    const originalCode = `graph TD
A["Start"]
B["End"]
A --> B`;

    // First Parse
    const parsed1 = parseMermaid(originalCode);

    // Generate
    const generated = generateMermaid(parsed1.nodes, parsed1.edges);

    // Second Parse
    const parsed2 = parseMermaid(generated);

    expect(parsed2.nodes).toHaveLength(parsed1.nodes.length);
    expect(parsed2.edges).toHaveLength(parsed1.edges.length);
    expect(parsed2.nodes.find(n => n.id === 'A')?.data.label).toBe('Start');
  });
});
