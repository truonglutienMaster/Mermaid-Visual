import { describe, it, expect } from 'vitest';
import { parseMermaid } from './parser';

describe('Mermaid Parser - Errors', () => {
    it('should throw error for blatantly invalid syntax', () => {
        // Our parser is permissive. It often treats things as nodes.
        // "A -->" : split by --> gives "A", ""
        // "A" is node. "" might be ignored or create empty node?
        // We need to define what "Invalid" means for MVP or make the parser stricter.

        // Let's verify what happens with "graph TD\nA -->"
        const code = "graph TD\nA -->";
        // The parser implementation:
        // lines.forEach...
        // if (line.includes('-->')) { ... split ... }
        // parts = ["A ", ""]
        // loop i=0..0
        // source="A", target=""
        // parseNodeString("") -> id=""
        // nodes.set("", ...)
        // edges.push(source="A", target="")

        // So it creates a node with empty ID. This might crash React Flow or be invisible.
        // We should throw if target is empty.

        expect(() => parseMermaid(code)).toThrow();
    });
});
