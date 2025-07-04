// UUID Generation utility for client-side use
// This provides proper UUID v4 generation without requiring external libraries

export function generateUUID(): string {
  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Alternative: Use crypto.randomUUID() if available (modern browsers)
export function generateUUIDModern(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback to custom generation
  return generateUUID();
}

// Session ID generators for specific use cases
export function generateSessionId(): string {
  return generateUUIDModern();
}

export function generateAIBuilderSessionId(): string {
  return generateUUIDModern();
}

export function generateAnalyticsSessionId(): string {
  return generateUUIDModern();
}

// For backward compatibility with string-based session IDs
export function generateStringSessionId(): string {
  return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}
