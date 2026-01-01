import { describe, it, expect } from 'vitest';
import { generateStableId, createEdgeId } from './id';

describe('ID Utils', () => {
  it('should generate stable IDs for the same content', () => {
    const id1 = generateStableId('Hello World');
    const id2 = generateStableId('Hello World');
    expect(id1).toBe(id2);
  });

  it('should generate different IDs for different content', () => {
    const id1 = generateStableId('Hello');
    const id2 = generateStableId('World');
    expect(id1).not.toBe(id2);
  });

  it('should create consistent edge IDs', () => {
    const edgeId = createEdgeId('A', 'B');
    expect(edgeId).toBe('e-A-B');
  });
});
