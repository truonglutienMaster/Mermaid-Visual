/**
 * Generates a stable ID based on input content.
 * Simple hash function for string to ensure deterministic IDs.
 */
export const generateStableId = (content: string): string => {
  let hash = 0;
  if (content.length === 0) return hash.toString();
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Make it positive and base36 for shorter string
  return Math.abs(hash).toString(36);
};

export const createEdgeId = (source: string, target: string): string => {
  return `e-${source}-${target}`;
};
