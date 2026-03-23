import { Plus, Trash2, MessageSquare, X } from 'lucide-react';
import UniLogo from './UniLogo';
import './Sidebar.css';

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  onClose,
  iconId,
}) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <UniLogo size={32} iconId={iconId} />
            <div className="sidebar__brand-text">
              <span className="sidebar__brand-name">UniBot</span>
              <span className="sidebar__brand-sub">Cooperativa Universitaria</span>
            </div>
          </div>
          <button className="sidebar__close-btn" onClick={onClose} title="Cerrar menu">
            <X size={20} />
          </button>
        </div>

        <button className="sidebar__new-btn" onClick={onNewSession}>
          <Plus size={18} />
          <span>Nueva conversacion</span>
        </button>

        <div className="sidebar__sessions">
          {sessions.length === 0 && (
            <p className="sidebar__empty">Inicia tu primera consulta</p>
          )}
          {sessions.map(session => (
            <div
              key={session.id}
              className={`sidebar__session ${session.id === activeSessionId ? 'sidebar__session--active' : ''}`}
              onClick={() => { onSelectSession(session.id); onClose(); }}
            >
              <MessageSquare size={15} />
              <span className="sidebar__session-title">{session.title}</span>
              <button
                className="sidebar__delete-btn"
                onClick={e => { e.stopPropagation(); onDeleteSession(session.id); }}
                title="Eliminar conversacion"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar__footer">
          <span className="sidebar__footer-text">Cooperativa Universitaria</span>
        </div>
      </aside>
    </>
  );
}
