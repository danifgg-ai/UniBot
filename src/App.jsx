import { useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useChatSessions } from './hooks/useChatSessions';
import { useSuggestedQuestions } from './hooks/useSuggestedQuestions';
import { useBotIcon } from './hooks/useBotIcon';
import { sendMessageToOracle } from './services/oracleAgent';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import AdminPage from './components/AdminPage';
import './App.css';

function ChatApp() {
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    addMessage,
    updateOciSessionId,
    clearAllSessions,
  } = useChatSessions();

  const {
    questions: suggestedQuestions,
    saveQuestions,
    resetToDefaults,
    DEFAULT_QUESTIONS,
  } = useSuggestedQuestions();

  const { iconId, saveIcon } = useBotIcon();

  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(() => {
    return window.location.hash === '#/admin' ? 'admin' : 'chat';
  });

  useEffect(() => {
    const handleHash = () => {
      setPage(window.location.hash === '#/admin' ? 'admin' : 'chat');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSendMessage = useCallback(async (content) => {
    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = createSession();
    }

    const userMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    addMessage(sessionId, userMessage);
    setIsLoading(true);

    try {
      const currentSession = sessions.find(s => s.id === sessionId);
      const { message, ociSessionId } = await sendMessageToOracle(
        content,
        sessionId,
        currentSession?.ociSessionId,
      );

      if (ociSessionId) {
        updateOciSessionId(sessionId, ociSessionId);
      }

      const assistantMessage = {
        role: 'assistant',
        content: message,
        timestamp: new Date().toISOString(),
      };
      addMessage(sessionId, assistantMessage);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Lo siento, ocurrio un error: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
      addMessage(sessionId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId, sessions, createSession, addMessage, updateOciSessionId]);

  const handleNewSession = () => {
    createSession();
    setSidebarOpen(false);
  };

  if (page === 'admin') {
    return (
      <AdminPage
        onBack={() => { window.location.hash = '#/'; setPage('chat'); }}
        onClearSessions={clearAllSessions}
        suggestedQuestions={suggestedQuestions}
        onSaveQuestions={saveQuestions}
        onResetQuestions={resetToDefaults}
        defaultQuestions={DEFAULT_QUESTIONS}
        iconId={iconId}
        onSaveIcon={saveIcon}
      />
    );
  }

  return (
    <div className="app">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onDeleteSession={deleteSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        iconId={iconId}
      />
      <ChatWindow
        session={activeSession}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onToggleSidebar={() => setSidebarOpen(true)}
        suggestedQuestions={suggestedQuestions}
        iconId={iconId}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ChatApp />
    </ThemeProvider>
  );
}
