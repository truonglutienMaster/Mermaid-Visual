import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock React Flow since it uses ResizeObserver and complex DOM
vi.mock('@xyflow/react', async () => {
    const actual = await vi.importActual<typeof import('@xyflow/react')>('@xyflow/react');
    return {
        ...actual,
        ReactFlow: ({ nodes }: any) => (
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
        // Placeholder for error testing
    });
});
