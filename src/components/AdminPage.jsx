import { useState, useEffect } from 'react';
import {
  ArrowLeft, Trash2, Shield, CheckCircle, XCircle, RefreshCw,
  Plus, GripVertical, X, RotateCcw, Save, MessageCircleQuestion, Bot,
} from 'lucide-react';
import { checkHealth } from '../services/oracleAgent';
import { BOT_ICONS, ICON_IDS } from './BotIcons';
import './AdminPage.css';

export default function AdminPage({
  onBack,
  onClearSessions,
  suggestedQuestions,
  onSaveQuestions,
  onResetQuestions,
  defaultQuestions,
  iconId,
  onSaveIcon,
}) {
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(true);
  const [editQuestions, setEditQuestions] = useState(suggestedQuestions || []);
  const [questionsSaved, setQuestionsSaved] = useState(false);

  const fetchHealth = async () => {
    setChecking(true);
    const result = await checkHealth();
    setHealth(result);
    setChecking(false);
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  useEffect(() => {
    setEditQuestions(suggestedQuestions || []);
  }, [suggestedQuestions]);

  const handleClear = () => {
    if (window.confirm('Estas seguro de que deseas eliminar todas las conversaciones? Esta accion no se puede deshacer.')) {
      onClearSessions();
    }
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...editQuestions];
    updated[index] = value;
    setEditQuestions(updated);
    setQuestionsSaved(false);
  };

  const handleAddQuestion = () => {
    setEditQuestions([...editQuestions, '']);
    setQuestionsSaved(false);
  };

  const handleRemoveQuestion = (index) => {
    const updated = editQuestions.filter((_, i) => i !== index);
    setEditQuestions(updated);
    setQuestionsSaved(false);
  };

  const handleSaveQuestions = () => {
    const filtered = editQuestions.filter(q => q.trim() !== '');
    onSaveQuestions(filtered);
    setEditQuestions(filtered);
    setQuestionsSaved(true);
    setTimeout(() => setQuestionsSaved(false), 3000);
  };

  const handleResetQuestions = () => {
    onResetQuestions();
    setEditQuestions(defaultQuestions);
    setQuestionsSaved(false);
  };

  return (
    <div className="admin">
      <div className="admin__header">
        <button className="admin__back" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Volver al chat</span>
        </button>
        <div className="admin__badge">
          <Shield size={14} />
          <span>Administracion</span>
        </div>
      </div>

      <div className="admin__content">
        {/* Estado del backend */}
        <div className="admin__card">
          <h2>Estado del Backend</h2>
          <p className="admin__desc">
            La conexion a Oracle Cloud se configura en el archivo <code>server/.env</code>.
            Aqui puedes verificar que el servidor y el agente estan funcionando correctamente.
          </p>

          {checking ? (
            <div className="admin__status-row">
              <RefreshCw size={16} className="admin__spinning" />
              <span>Verificando conexion...</span>
            </div>
          ) : health?.status === 'ok' ? (
            <div className="admin__status-list">
              <div className="admin__status-row">
                {health.clientInitialized ? <CheckCircle size={16} className="admin__icon-ok" /> : <XCircle size={16} className="admin__icon-err" />}
                <span>Cliente OCI: {health.clientInitialized ? 'Conectado' : 'No inicializado'}</span>
              </div>
              <div className="admin__status-row">
                {health.agentConfigured ? <CheckCircle size={16} className="admin__icon-ok" /> : <XCircle size={16} className="admin__icon-err" />}
                <span>Agente: {health.agentConfigured ? 'Configurado' : 'No configurado'}</span>
              </div>
            </div>
          ) : (
            <div className="admin__status-list">
              <div className="admin__status-row">
                <XCircle size={16} className="admin__icon-err" />
                <span>No se pudo conectar al servidor backend (http://localhost:3001)</span>
              </div>
              <p className="admin__hint">
                Asegurate de que el servidor este corriendo con: <code>npm run server</code>
              </p>
            </div>
          )}

          <button className="admin__refresh-btn" onClick={fetchHealth} disabled={checking}>
            <RefreshCw size={16} />
            <span>Verificar de nuevo</span>
          </button>
        </div>

        {/* Editor de preguntas sugeridas */}
        <div className="admin__card">
          <div className="admin__card-header">
            <div>
              <h2>
                <MessageCircleQuestion size={20} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
                Preguntas sugeridas
              </h2>
              <p className="admin__desc">
                Estas preguntas aparecen como sugerencias rapidas al iniciar una nueva conversacion.
                Los colaboradores pueden hacer clic en ellas para consultar directamente.
              </p>
            </div>
          </div>

          <div className="admin__questions-list">
            {editQuestions.map((question, index) => (
              <div key={index} className="admin__question-row">
                <div className="admin__question-grip">
                  <GripVertical size={14} />
                </div>
                <span className="admin__question-number">{index + 1}</span>
                <input
                  type="text"
                  className="admin__question-input"
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder="Escribe una pregunta sugerida..."
                />
                <button
                  className="admin__question-remove"
                  onClick={() => handleRemoveQuestion(index)}
                  title="Eliminar pregunta"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="admin__questions-actions">
            <button className="admin__add-question-btn" onClick={handleAddQuestion}>
              <Plus size={16} />
              <span>Agregar pregunta</span>
            </button>

            <div className="admin__questions-actions-right">
              <button className="admin__reset-btn" onClick={handleResetQuestions} title="Restaurar preguntas por defecto">
                <RotateCcw size={16} />
                <span>Restaurar</span>
              </button>
              <button
                className="admin__save-btn"
                onClick={handleSaveQuestions}
                disabled={questionsSaved}
              >
                {questionsSaved ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Guardado</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Guardar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Selector de icono */}
        <div className="admin__card">
          <h2>
            <Bot size={20} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
            Icono del Bot
          </h2>
          <p className="admin__desc">
            Elige el icono que se mostrara en el chat, sidebar y pantalla de bienvenida.
          </p>

          <div className="admin__icon-grid">
            {ICON_IDS.map((id) => {
              const icon = BOT_ICONS[id];
              const isActive = iconId === id;
              return (
                <button
                  key={id}
                  className={`admin__icon-card ${isActive ? 'admin__icon-card--active' : ''}`}
                  onClick={() => onSaveIcon(id)}
                  title={icon.name}
                >
                  <div className="admin__icon-preview">
                    <icon.Logo />
                  </div>
                  <div className="admin__icon-info">
                    <span className="admin__icon-name">{icon.name}</span>
                    <span className="admin__icon-desc">{icon.description}</span>
                  </div>
                  {isActive && (
                    <div className="admin__icon-check">
                      <CheckCircle size={18} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuracion del servidor */}
        <div className="admin__card">
          <h2>Configuracion del servidor</h2>
          <p className="admin__desc">Para configurar las credenciales de Oracle Cloud, edita el archivo:</p>
          <code className="admin__code-block">server/.env</code>
          <p className="admin__desc" style={{ marginTop: 12 }}>Variables requeridas:</p>
          <ul className="admin__env-list">
            <li><code>OCI_TENANCY_OCID</code> - OCID del tenancy</li>
            <li><code>OCI_USER_OCID</code> - OCID del usuario</li>
            <li><code>OCI_FINGERPRINT</code> - Fingerprint de la API Key</li>
            <li><code>OCI_PRIVATE_KEY_PATH</code> - Ruta al archivo .pem</li>
            <li><code>OCI_REGION</code> - Region (ej: sa-saopaulo-1)</li>
            <li><code>OCI_AGENT_ENDPOINT_ID</code> - OCID del endpoint del agente</li>
          </ul>
        </div>

        {/* Zona de peligro */}
        <div className="admin__card admin__card--danger">
          <h2>Gestion de datos</h2>
          <p className="admin__desc">Administra las conversaciones almacenadas localmente en este navegador.</p>
          <div className="admin__danger-row">
            <div>
              <strong>Eliminar todas las conversaciones</strong>
              <span>Se eliminaran permanentemente del almacenamiento local</span>
            </div>
            <button className="admin__danger-btn" onClick={handleClear}>
              <Trash2 size={16} />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
