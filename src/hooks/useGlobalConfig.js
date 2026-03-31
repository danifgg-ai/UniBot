import { useState, useEffect, useCallback } from 'react';
import { fetchGlobalConfig, saveGlobalConfig } from '../services/oracleAgent';

const CACHE_KEY = 'unibot-global-config';

const DEFAULTS = {
  suggestedQuestions: [
    'Como solicito vacaciones?',
    'Cual es el proceso de aprobacion de creditos?',
    'Como reporto un incidente de seguridad?',
    'Donde consulto el reglamento interno?',
  ],
  iconId: 'standard',
};

function loadCache() {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved ? JSON.parse(saved) : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function saveCache(config) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(config));
  } catch { /* ignore */ }
}

export function useGlobalConfig() {
  const [config, setConfig] = useState(loadCache);
  const [loading, setLoading] = useState(true);

  // Fetch from server on mount
  useEffect(() => {
    fetchGlobalConfig()
      .then((serverConfig) => {
        setConfig(serverConfig);
        saveCache(serverConfig);
      })
      .catch(() => {
        // Use cached/defaults on error
      })
      .finally(() => setLoading(false));
  }, []);

  const saveQuestions = useCallback(async (suggestedQuestions) => {
    const updated = { ...config, suggestedQuestions };
    setConfig(updated);
    saveCache(updated);
    try {
      await saveGlobalConfig({ suggestedQuestions });
    } catch (err) {
      console.error('[Config] Error al guardar preguntas:', err);
    }
  }, [config]);

  const resetQuestions = useCallback(async () => {
    const updated = { ...config, suggestedQuestions: DEFAULTS.suggestedQuestions };
    setConfig(updated);
    saveCache(updated);
    try {
      await saveGlobalConfig({ suggestedQuestions: DEFAULTS.suggestedQuestions });
    } catch (err) {
      console.error('[Config] Error al restaurar preguntas:', err);
    }
  }, [config]);

  const saveIcon = useCallback(async (iconId) => {
    const updated = { ...config, iconId };
    setConfig(updated);
    saveCache(updated);
    try {
      await saveGlobalConfig({ iconId });
    } catch (err) {
      console.error('[Config] Error al guardar icono:', err);
    }
  }, [config]);

  return {
    suggestedQuestions: config.suggestedQuestions || DEFAULTS.suggestedQuestions,
    iconId: config.iconId || DEFAULTS.iconId,
    saveQuestions,
    resetQuestions,
    saveIcon,
    loading,
    DEFAULT_QUESTIONS: DEFAULTS.suggestedQuestions,
  };
}
