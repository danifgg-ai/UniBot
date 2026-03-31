import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load defaults from bundled config file
let defaults;
try {
  defaults = JSON.parse(readFileSync(join(__dirname, '../config/admin-config.json'), 'utf8'));
} catch {
  defaults = {
    suggestedQuestions: [
      'Como solicito vacaciones?',
      'Cual es el proceso de aprobacion de creditos?',
      'Como reporto un incidente de seguridad?',
      'Donde consulto el reglamento interno?',
    ],
    iconId: 'standard',
  };
}

// In-memory config (persists across warm invocations on Vercel)
let currentConfig = { ...defaults };

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json(currentConfig);
  }

  if (req.method === 'POST') {
    const { suggestedQuestions, iconId } = req.body || {};

    if (suggestedQuestions !== undefined) {
      currentConfig.suggestedQuestions = suggestedQuestions;
    }
    if (iconId !== undefined) {
      currentConfig.iconId = iconId;
    }

    console.log('[Config] Configuracion actualizada:', JSON.stringify(currentConfig).slice(0, 200));
    return res.json({ ok: true, config: currentConfig });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
