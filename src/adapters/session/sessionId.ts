const SESSION_ID_KEY = 'vigidoc_session_id';

function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Gets or creates a session ID stored in sessionStorage.
 * The session ID persists for the browser tab lifetime.
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // SSR: return empty, will be set on client
    return '';
  }

  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Updates the session ID (e.g., when backend returns a different one).
 */
export function setSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSION_ID_KEY, sessionId);
}
