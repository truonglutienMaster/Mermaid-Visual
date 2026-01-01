import React, { useState } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { Button, Textarea } from './ui';
import { ArrowLeftRight, Download, Upload } from 'lucide-react';

const MermaidEditor: React.FC = () => {
  const { mermaidCode, setMermaidCode, importMermaid, syncToMermaid } = useWorkflowStore();
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    try {
      importMermaid();
      setError(null);
    } catch (e) {
      setError('Failed to import: Invalid syntax');
    }
  };

  const handleExport = () => {
    syncToMermaid();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mermaidCode);
    alert('Copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-full p-4 border-r bg-gray-50 w-96">
      <h2 className="text-lg font-bold mb-4">Mermaid Editor</h2>

      <div className="flex gap-2 mb-4">
        <Button onClick={handleImport} className="flex-1" title="Render to Canvas">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button onClick={handleExport} className="flex-1" variant="outline" title="Sync from Canvas">
           <Download className="w-4 h-4 mr-2" />
           Export
        </Button>
      </div>

      <Textarea
        className="flex-1 font-mono text-sm mb-2 resize-none"
        value={mermaidCode}
        onChange={(e) => setMermaidCode(e.target.value)}
        spellCheck={false}
      />

      {error && (
        <div className="p-2 mb-2 text-sm text-red-600 bg-red-100 rounded" data-testid="error-message">
          {error}
        </div>
      )}

      <Button onClick={handleCopy} className="mt-2 bg-slate-600 hover:bg-slate-700">
        Copy Mermaid Code
      </Button>

      <div className="mt-4 text-xs text-gray-500">
        <p>Supported Syntax (MVP):</p>
        <ul className="list-disc ml-4">
            <li>graph TD/LR...</li>
            <li>Node[Label]</li>
            <li>A --&gt; B</li>
            <li>A --&gt;|Label| B</li>
        </ul>
      </div>
    </div>
  );
};

export default MermaidEditor;
