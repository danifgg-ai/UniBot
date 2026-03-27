import common from 'oci-common';

// ── Lazy singleton OCI client (persists across warm invocations) ──
let _client = null;
let _initError = null;
let _initialized = false;

// In-memory session map (warm instance cache)
const sessionMap = new Map();

async function getClient() {
  if (_initialized) {
    if (_initError) throw new Error(_initError);
    return _client;
  }
  _initialized = true;

  try {
    const {
      OCI_TENANCY_OCID,
      OCI_USER_OCID,
      OCI_FINGERPRINT,
      OCI_PRIVATE_KEY_CONTENT,
      OCI_REGION,
    } = process.env;

    if (!OCI_TENANCY_OCID || !OCI_USER_OCID || !OCI_FINGERPRINT || !OCI_PRIVATE_KEY_CONTENT) {
      throw new Error(
        'Faltan variables de entorno OCI. Configura OCI_TENANCY_OCID, OCI_USER_OCID, OCI_FINGERPRINT, OCI_PRIVATE_KEY_CONTENT en Vercel.'
      );
    }

    // Handle escaped newlines from Vercel env vars
    const privateKey = OCI_PRIVATE_KEY_CONTENT.includes('-----BEGIN')
      ? OCI_PRIVATE_KEY_CONTENT
      : OCI_PRIVATE_KEY_CONTENT.replace(/\\n/g, '\n');

    const region = common.Region.fromRegionId(OCI_REGION || 'sa-saopaulo-1');

    const provider = new common.SimpleAuthenticationDetailsProvider(
      OCI_TENANCY_OCID,
      OCI_USER_OCID,
      OCI_FINGERPRINT,
      privateKey,
      null,
      region,
    );

    const agentRuntime = await import('oci-generativeaiagentruntime');
    const ClientClass =
      agentRuntime.GenerativeAiAgentRuntimeClient ||
      agentRuntime.default?.GenerativeAiAgentRuntimeClient;

    if (!ClientClass) {
      throw new Error('No se encontro GenerativeAiAgentRuntimeClient en el SDK');
    }

    const regionId = OCI_REGION || 'sa-saopaulo-1';
    _client = new ClientClass({ authenticationDetailsProvider: provider });
    _client.regionId = regionId;
    _client.endpoint = `https://agent-runtime.generativeai.${regionId}.oci.oraclecloud.com`;

    console.log(`[OCI] Cliente inicializado - endpoint: ${_client.endpoint}`);
    return _client;
  } catch (err) {
    _initError = err.message;
    console.error('[OCI] Error al inicializar:', err.message);
    throw err;
  }
}

async function getOrCreateOciSession(client, frontendSessionId, existingOciSessionId) {
  const AGENT_ENDPOINT_ID = process.env.OCI_AGENT_ENDPOINT_ID;

  // 1. Use OCI session ID sent from frontend (survives cold starts)
  if (existingOciSessionId) {
    console.log(`[Session] Usando ociSessionId del frontend: ${existingOciSessionId}`);
    return existingOciSessionId;
  }

  // 2. Use warm-instance cache
  if (frontendSessionId && sessionMap.has(frontendSessionId)) {
    const cached = sessionMap.get(frontendSessionId);
    console.log(`[Session] Reutilizando cache: ${cached}`);
    return cached;
  }

  // 3. Create new OCI session
  console.log('[Session] Creando nueva sesion OCI...');
  const response = await client.createSession({
    createSessionDetails: {
      displayName: `chat-${frontendSessionId || Date.now()}`,
      description: 'Sesion de chatbot Cooperativa Universitaria',
      agentEndpointId: AGENT_ENDPOINT_ID,
    },
    agentEndpointId: AGENT_ENDPOINT_ID,
  });

  const ociSessionId = response.session.id;
  console.log(`[Session] Nueva sesion OCI: ${ociSessionId}`);

  if (frontendSessionId) {
    sessionMap.set(frontendSessionId, ociSessionId);
  }

  return ociSessionId;
}

export default async function handler(req, res) {
  // CORS headers (for local dev if needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, ociSessionId: frontendOciSessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    const AGENT_ENDPOINT_ID = process.env.OCI_AGENT_ENDPOINT_ID;
    if (!AGENT_ENDPOINT_ID) {
      return res.status(500).json({ error: 'OCI_AGENT_ENDPOINT_ID no esta configurado' });
    }

    const client = await getClient();
    const ociSessionId = await getOrCreateOciSession(client, sessionId, frontendOciSessionId);

    const chatRequest = {
      agentEndpointId: AGENT_ENDPOINT_ID,
      chatDetails: {
        userMessage: message,
        shouldStream: false,
        sessionId: ociSessionId,
      },
    };

    console.log(`[Chat] Enviando: "${message.slice(0, 60)}..." (ociSession: ${ociSessionId})`);
    const response = await client.chat(chatRequest);
    const chatResult = response.chatResult;

    let reply = 'No se obtuvo respuesta del agente.';
    if (chatResult?.message?.content?.text) {
      reply = chatResult.message.content.text;
    } else if (typeof chatResult?.message?.content === 'string') {
      reply = chatResult.message.content;
    } else if (chatResult?.message) {
      reply = JSON.stringify(chatResult.message);
    }

    console.log(`[Chat] Respuesta OK (${reply.length} chars)`);
    res.json({ message: reply, ociSessionId });
  } catch (error) {
    console.error('[Chat] Error:', error.statusCode || '', error.message);

    let userMessage;
    switch (error.statusCode) {
      case 401:
        userMessage = 'Error de autenticacion OCI. Verifica tus credenciales.';
        break;
      case 404:
        userMessage = 'Endpoint del agente no encontrado. Verifica OCI_AGENT_ENDPOINT_ID.';
        break;
      case 429:
        userMessage = 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.';
        break;
      default:
        userMessage = `Error Oracle: ${error.message}`;
    }
    res.status(error.statusCode || 500).json({ error: userMessage });
  }
}
