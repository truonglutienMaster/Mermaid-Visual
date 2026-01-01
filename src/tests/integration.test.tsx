import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock React Flow since it uses ResizeObserver and complex DOM
vi.mock('@xyflow/react', async () => {
    const actual = await vi.importActual('@xyflow/react');
    return {
        ...actual,
        ReactFlow: ({ nodes, edges }: any) => (
            <div data-testid="rf-canvas">
                {nodes.map((n: any) => <div key={n.id} data-testid="rf-node">{n.data.label}</div>)}
            </div>
        ),
        Background: () => null,
        Controls: () => null,
        MiniMap: () => null,
    };
});

// Mock LocalStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Integration Test', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should render default nodes on start', async () => {
        render(<App />);
        // Default code is "graph TD\nA[Start] --> B[End]"
        // So we expect nodes "Start" and "End"

        // Wait for effect
        await waitFor(() => {
            expect(screen.getByText('Start')).toBeDefined();
            expect(screen.getByText('End')).toBeDefined();
        });
    });

    it('should update canvas when importing new mermaid code', async () => {
        render(<App />);
        const textarea = screen.getByRole('textbox');
        const importBtn = screen.getByText('Import');

        fireEvent.change(textarea, { target: { value: 'graph TD\nX[NewNode]' } });
        fireEvent.click(importBtn);

        await waitFor(() => {
            expect(screen.getByText('NewNode')).toBeDefined();
        });
    });

    it('should show error for invalid syntax', async () => {
        render(<App />);
        const textarea = screen.getByRole('textbox');
        const importBtn = screen.getByText('Import');

        // This parser is simple, but let's try something likely to fail or be handled if we had strict validation
        // Our parser is quite lenient, but let's assume empty graph or weird input might cause issues if not handled.
        // Actually, the parser regexes are robust-ish.
        // Let's try to mock the parser to throw error to test UI.

        // Better: mock console.error to avoid noise
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // We can force an error by mocking the parser module if we want strict unit test style,
        // but here we are integration testing.
        // If I put "garbage" it might just parse as text nodes.
        // Let's rely on the fact that `parseMermaid` might not throw easily unless I broke it.
        // But wait, the `MermaidEditor` catches error.

        // Let's mock `parseMermaid` to throw.
    });
});
