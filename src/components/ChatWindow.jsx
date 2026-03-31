import { useState, useRef, useEffect } from 'react';
import { Send, Menu, User, Sun, Moon, Copy, Check, RotateCcw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { UniBotAvatar, UniBotHero } from './UniLogo';
import UniLogo from './UniLogo';
import './ChatWindow.css';

export default function ChatWindow({
  session,
  onSendMessage,
  onClearChat,
  isLoading,
  onToggleSidebar,
  suggestedQuestions,
  iconId,
}) {
  const [input, setInput] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const { darkMode, toggleTheme } = useTheme();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  // Auto-focus en el textarea cuando cambia de sesion o termina de cargar
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [session?.id, isLoading]);

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Focus textarea despues de setear la sugerencia
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const headerContent = (
    <div className="chat-window__header">
      <button className="chat-window__menu-btn" onClick={onToggleSidebar}>
        <Menu size={22} />
      </button>
      <div className="chat-window__header-brand">
        <UniLogo size={24} iconId={iconId} />
        <h1 className="chat-window__title">
          {session ? session.title : 'UniBot'}
        </h1>
      </div>
      {session?.messages?.length > 0 && (
        <button
          className="chat-window__header-btn"
          onClick={onClearChat}
          title="Limpiar conversacion actual"
        >
          <RotateCcw size={18} />
        </button>
      )}
      <button
        className="chat-window__header-btn"
        onClick={toggleTheme}
        title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );

  if (!session) {
    return (
      <div className="chat-window">
        {headerContent}
        <div className="chat-window__empty">
          <UniBotHero size={130} iconId={iconId} />
          <h2>Hola, soy <span className="chat-window__accent">UniBot</span></h2>
          <p>Tu asistente inteligente de Cooperativa Universitaria.<br />Crea una nueva conversacion para comenzar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {headerContent}

      <div className="chat-window__messages">
        {session.messages.length === 0 && (
          <div className="chat-window__welcome">
            <UniBotHero size={100} iconId={iconId} />
            <h3>Como puedo ayudarte hoy?</h3>
            <p>Consultame sobre procesos, procedimientos, politicas internas y mas.</p>
            {suggestedQuestions && suggestedQuestions.length > 0 && (
              <div className="chat-window__suggestions">
                {suggestedQuestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    className="chat-window__suggestion"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {session.messages.map((msg, i) => (
          <div key={i} className={`chat-message chat-message--${msg.role}`}>
            <div className="chat-message__avatar">
              {msg.role === 'user' ? <User size={16} /> : <UniBotAvatar size={34} iconId={iconId} />}
            </div>
            <div className="chat-message__content">
              <span className="chat-message__sender">
                {msg.role === 'user' ? 'Tu' : 'UniBot'}
              </span>
              <div className="chat-message__bubble">
                <p className="chat-message__text">{msg.content}</p>
              </div>
              <div className="chat-message__footer">
                <span className="chat-message__time">
                  {new Date(msg.timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.role === 'assistant' && (
                  <button
                    className={`chat-message__copy ${copiedIdx === i ? 'chat-message__copy--copied' : ''}`}
                    onClick={() => handleCopy(msg.content, i)}
                    title={copiedIdx === i ? 'Copiado!' : 'Copiar respuesta'}
                  >
                    {copiedIdx === i ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedIdx === i ? 'Copiado' : 'Copiar'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar">
              <UniBotAvatar size={34} iconId={iconId} />
            </div>
            <div className="chat-message__content">
              <span className="chat-message__sender">UniBot</span>
              <div className="chat-message__bubble chat-message__bubble--loading">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-window__input-area" onSubmit={handleSubmit}>
        <div className="chat-window__input-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-window__input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta a UniBot..."
            rows={1}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            className="chat-window__send-btn"
            disabled={!input.trim() || isLoading}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="chat-window__disclaimer">
          UniBot es un asistente de IA. Verifica la informacion con las fuentes oficiales internas.
        </p>
      </form>
    </div>
  );
}
