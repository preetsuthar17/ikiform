export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateUUIDModern(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return generateUUID();
}

export function generateSessionId(): string {
  return generateUUIDModern();
}

export function generateAIBuilderSessionId(): string {
  return generateUUIDModern();
}

export function generateAnalyticsSessionId(): string {
  return generateUUIDModern();
}

export function generateStringSessionId(): string {
  return (
    "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
  );
}
