import { useState, useCallback } from 'react';

const STORAGE_KEY = 'chatbot-suggested-questions';

const DEFAULT_QUESTIONS = [
  'Como solicito vacaciones?',
  'Cual es el proceso de aprobacion de creditos?',
  'Como reporto un incidente de seguridad?',
  'Donde consulto el reglamento interno?',
];

function loadQuestions() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fall through to defaults
    }
  }
  return DEFAULT_QUESTIONS;
}

export function useSuggestedQuestions() {
  const [questions, setQuestions] = useState(loadQuestions);

  const saveQuestions = useCallback((newQuestions) => {
    const filtered = newQuestions.filter(q => q.trim() !== '');
    setQuestions(filtered);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }, []);

  const resetToDefaults = useCallback(() => {
    setQuestions(DEFAULT_QUESTIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_QUESTIONS));
  }, []);

  return { questions, saveQuestions, resetToDefaults, DEFAULT_QUESTIONS };
}
