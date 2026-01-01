import React, { useEffect } from 'react';
import WorkflowCanvas from './components/WorkflowCanvas';
import MermaidEditor from './components/MermaidEditor';
import { useWorkflowStore } from './store/useWorkflowStore';

function App() {
  const { importMermaid } = useWorkflowStore();

  // Initial load
  useEffect(() => {
    // Load from localstorage if available, else init default
    const saved = localStorage.getItem('workflow-store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        useWorkflowStore.setState(parsed);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    } else {
        // Render default code
        importMermaid();
    }

    // Subscribe to changes for Autosave
    const unsub = useWorkflowStore.subscribe((state) => {
        // Exclude functions and dom objects if any, stick to serializable
        const { nodes, edges, mermaidCode } = state;
        localStorage.setItem('workflow-store', JSON.stringify({ nodes, edges, mermaidCode }));
    });

    return () => unsub();
  }, [importMermaid]);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <MermaidEditor />
      <div className="flex-1 h-full">
        <WorkflowCanvas />
      </div>
    </div>
  );
}

export default App;
