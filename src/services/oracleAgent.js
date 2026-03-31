const API_BASE = import.meta.env.VITE_API_URL || '';

export async function sendMessageToOracle(message, sessionId, ociSessionId) {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sessionId,
      ociSessionId: ociSessionId || undefined,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Error del servidor: ${response.status}`);
  }

  return { message: data.message, ociSessionId: data.ociSessionId };
}

export async function fetchGlobalConfig() {
  const response = await fetch(`${API_BASE}/api/config`);
  if (!response.ok) throw new Error('Error al cargar configuracion');
  return response.json();
}

export async function saveGlobalConfig(config) {
  const response = await fetch(`${API_BASE}/api/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error('Error al guardar configuracion');
  return response.json();
}

export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return await response.json();
  } catch {
    return { status: 'error', clientInitialized: false, agentConfigured: false };
  }
}
