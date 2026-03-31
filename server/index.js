import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import common from 'oci-common';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Manually load .env if --env-file didn't pick it up ──
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
  console.log('[ENV] Archivo server/.env cargado');
} else {
  console.warn('[ENV] ADVERTENCIA: No se encontro server/.env');
}

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── OCI Authentication ──
let client = null;
let initError = null;

function initClient() {
  // Try ~/.oci/config first
  try {
    const provider = new common.ConfigFileAuthenticationDetailsProvider();
    console.log('[OCI] Auth via ~/.oci/config');
    return provider;
  } catch (e) {
    console.log('[OCI] ~/.oci/config no disponible:', e.message?.slice(0, 80));
  }

  // Fallback: env vars
  const {
    OCI_TENANCY_OCID,
    OCI_USER_OCID,
    OCI_FINGERPRINT,
    OCI_PRIVATE_KEY_PATH,
    OCI_REGION,
  } = process.env;

  console.log('[OCI] Verificando variables de entorno...');
  console.log(`  TENANCY:     ${OCI_TENANCY_OCID ? 'OK (' + OCI_TENANCY_OCID.slice(0, 30) + '...)' : 'FALTA'}`);
  console.log(`  USER:        ${OCI_USER_OCID ? 'OK (' + OCI_USER_OCID.slice(0, 30) + '...)' : 'FALTA'}`);
  console.log(`  FINGERPRINT: ${OCI_FINGERPRINT ? 'OK' : 'FALTA'}`);
  console.log(`  PRIVATE_KEY: ${OCI_PRIVATE_KEY_PATH ? 'OK (' + OCI_PRIVATE_KEY_PATH + ')' : 'FALTA'}`);
  console.log(`  REGION:      ${OCI_REGION || 'sa-saopaulo-1 (default)'}`);

  if (!OCI_TENANCY_OCID || !OCI_USER_OCID || !OCI_FINGERPRINT || !OCI_PRIVATE_KEY_PATH) {
    throw new Error('Faltan variables de entorno OCI. Revisa server/.env');
  }

  // Resolve key path relative to server/ dir if not absolute
  let keyPath = OCI_PRIVATE_KEY_PATH;
  if (!path.isAbsolute(keyPath)) {
    keyPath = path.resolve(__dirname, keyPath);
  }

  if (!fs.existsSync(keyPath)) {
    throw new Error(`No se encontro la clave privada en: ${keyPath}`);
  }

  const privateKey = fs.readFileSync(keyPath, 'utf8');
  console.log(`[OCI] Clave privada leida (${privateKey.length} bytes)`);

  const region = common.Region.fromRegionId(OCI_REGION || 'sa-saopaulo-1');

  const provider = new common.SimpleAuthenticationDetailsProvider(
    OCI_TENANCY_OCID,
    OCI_USER_OCID,
    OCI_FINGERPRINT,
    privateKey,
    null,
    region
  );

  console.log('[OCI] Auth via variables de entorno (.env)');
  return provider;
}

// Initialize
try {
  const provider = initClient();

  // Dynamic import of oci-generativeaiagentruntime
  const agentRuntime = await import('oci-generativeaiagentruntime');
  const ClientClass = agentRuntime.GenerativeAiAgentRuntimeClient
    || agentRuntime.default?.GenerativeAiAgentRuntimeClient;

  if (!ClientClass) {
    // List available exports for debugging
    console.log('[OCI] Exports disponibles en oci-generativeaiagentruntime:', Object.keys(agentRuntime));
    throw new Error('No se encontro GenerativeAiAgentRuntimeClient en el SDK');
  }

  const region = process.env.OCI_REGION || 'sa-saopaulo-1';
  client = new ClientClass({ authenticationDetailsProvider: provider });
  client.regionId = region;
  // Set the endpoint explicitly for the Gen AI Agent Runtime service
  client.endpoint = `https://agent-runtime.generativeai.${region}.oci.oraclecloud.com`;

  console.log(`[OCI] Cliente creado - endpoint: ${client.endpoint}`);
} catch (err) {
  initError = err.message;
  console.error('[OCI] ERROR al inicializar cliente:', err.message);
}

const AGENT_ENDPOINT_ID = process.env.OCI_AGENT_ENDPOINT_ID;

// In-memory session tracking (maps frontend sessionId -> OCI sessionId)
const sessionMap = new Map();

// ── Helper: create an OCI session for a new conversation ──
async function getOrCreateOciSession(frontendSessionId) {
  // Return existing OCI session if we already have one
  if (frontendSessionId && sessionMap.has(frontendSessionId)) {
    const ociSessionId = sessionMap.get(frontendSessionId);
    console.log(`[Session] Reutilizando sesion OCI: ${ociSessionId}`);
    return ociSessionId;
  }

  // Create a new OCI session
  console.log('[Session] Creando nueva sesion OCI...');
  const createSessionRequest = {
    createSessionDetails: {
      displayName: `chat-${frontendSessionId || Date.now()}`,
      description: 'Sesion de chatbot Cooperativa Universitaria',
      agentEndpointId: AGENT_ENDPOINT_ID,
    },
    agentEndpointId: AGENT_ENDPOINT_ID,
  };

  const sessionResponse = await client.createSession(createSessionRequest);
  const ociSessionId = sessionResponse.session.id;
  console.log(`[Session] Nueva sesion OCI creada: ${ociSessionId}`);

  // Map frontend session to OCI session
  if (frontendSessionId) {
    sessionMap.set(frontendSessionId, ociSessionId);
  }

  return ociSessionId;
}

// ── Helper: send chat with auto-retry on expired session ──
async function sendChatWithRetry(message, frontendSessionId) {
  let ociSessionId = await getOrCreateOciSession(frontendSessionId);

  const chatRequest = {
    agentEndpointId: AGENT_ENDPOINT_ID,
    chatDetails: {
      userMessage: message,
      shouldStream: false,
      sessionId: ociSessionId,
    },
  };

  try {
    console.log(`[Chat] Enviando: "${message.slice(0, 60)}..." (ociSession: ${ociSessionId})`);
    const response = await client.chat(chatRequest);
    return { chatResult: response.chatResult, ociSessionId };
  } catch (error) {
    // 404 during chat = expired/invalid session -> recreate and retry once
    if (error.statusCode === 404 && frontendSessionId) {
      console.log(`[Chat] Sesion expirada (404), recreando sesion para ${frontendSessionId}...`);
      sessionMap.delete(frontendSessionId);

      const newOciSessionId = await getOrCreateOciSession(frontendSessionId);
      chatRequest.chatDetails.sessionId = newOciSessionId;

      console.log(`[Chat] Reintentando con nueva sesion: ${newOciSessionId}`);
      const retryResponse = await client.chat(chatRequest);
      return { chatResult: retryResponse.chatResult, ociSessionId: newOciSessionId };
    }
    throw error;
  }
}

// ── Chat endpoint ──
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    if (!client) {
      return res.status(500).json({
        error: `Cliente OCI no inicializado: ${initError || 'Error desconocido'}`,
      });
    }

    if (!AGENT_ENDPOINT_ID) {
      return res.status(500).json({ error: 'OCI_AGENT_ENDPOINT_ID no esta configurado en server/.env' });
    }

    const { chatResult, ociSessionId } = await sendChatWithRetry(message, sessionId);

    // Extract text response
    let reply = 'No se obtuvo respuesta del agente.';
    if (chatResult?.message?.content?.text) {
      reply = chatResult.message.content.text;
    } else if (typeof chatResult?.message?.content === 'string') {
      reply = chatResult.message.content;
    } else if (chatResult?.message) {
      reply = JSON.stringify(chatResult.message);
    }

    console.log(`[Chat] Respuesta OK (${reply.length} chars)`);
    res.json({ message: reply, sessionId: ociSessionId });
  } catch (error) {
    console.error('[Chat] Error:', error.statusCode || '', error.message);
    console.error('[Chat] Detalle:', error.serviceCode || '', error.opcRequestId || '');

    let userMessage;
    switch (error.statusCode) {
      case 401:
        userMessage = 'Error de autenticacion OCI. Verifica tus credenciales en server/.env';
        break;
      case 404:
        userMessage = 'Endpoint del agente no encontrado. Verifica el OCI_AGENT_ENDPOINT_ID.';
        break;
      case 429:
        userMessage = 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.';
        break;
      default:
        userMessage = `Error Oracle: ${error.message}`;
    }
    res.status(error.statusCode || 500).json({ error: userMessage });
  }
});

// ── Admin config (persistent via JSON file) ──
const configPath = path.join(__dirname, '..', 'config', 'admin-config.json');

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch {
    return {
      suggestedQuestions: ['Como solicito vacaciones?', 'Cual es el proceso de aprobacion de creditos?', 'Como reporto un incidente de seguridad?', 'Donde consulto el reglamento interno?'],
      iconId: 'standard',
    };
  }
}

function writeConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

app.get('/api/config', (req, res) => {
  res.json(readConfig());
});

app.post('/api/config', (req, res) => {
  const current = readConfig();
  const { suggestedQuestions, iconId } = req.body || {};

  if (suggestedQuestions !== undefined) current.suggestedQuestions = suggestedQuestions;
  if (iconId !== undefined) current.iconId = iconId;

  writeConfig(current);
  console.log('[Config] Guardado en', configPath);
  res.json({ ok: true, config: current });
});

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: client ? 'ok' : 'error',
    clientInitialized: !!client,
    agentConfigured: !!AGENT_ENDPOINT_ID,
    initError: initError || null,
    endpoint: client?.endpoint || null,
  });
});

// ── Start server ──
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('');
  console.log(`=== Servidor Cooperativa Universitaria ===`);
  console.log(`URL:           http://localhost:${PORT}`);
  console.log(`Cliente OCI:   ${client ? 'INICIALIZADO' : 'NO INICIALIZADO'}`);
  console.log(`Agent ID:      ${AGENT_ENDPOINT_ID ? 'configurado' : 'NO configurado'}`);
  if (initError) console.log(`Error init:    ${initError}`);
  console.log('');
});
