import { useState, useCallback } from 'react';

const STORAGE_KEY = 'unibot-icon';
const DEFAULT_ICON = 'standard';

export function useBotIcon() {
  const [iconId, setIconId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_ICON;
    } catch {
      return DEFAULT_ICON;
    }
  });

  const saveIcon = useCallback((id) => {
    setIconId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // localStorage no disponible
    }
  }, []);

  return { iconId, saveIcon, DEFAULT_ICON };
}
