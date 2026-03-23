const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function sendMessageToOracle(message, sessionId) {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sessionId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Error del servidor: ${response.status}`);
  }

  return data.message;
}

export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return await response.json();
  } catch {
    return { status: 'error', clientInitialized: false, agentConfigured: false };
  }
}
