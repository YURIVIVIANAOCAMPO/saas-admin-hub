import React, { useState } from 'react';
import {
  Key,
  Copy,
  Plus,
  Trash2,
  Send,
  Save,
  Globe,
  Lock,
} from 'lucide-react';
import type { ApiKey } from '../types';
import { INITIAL_API_KEYS } from '../data/mockData';

interface SettingsViewProps {
  onTriggerToast: (msg: string, type?: 'success' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onTriggerToast }) => {
  const [saasName, setSaasName] = useState('AuraSaaS Cloud Platform');
  const [supportEmail, setSupportEmail] = useState('soporte@aurasaas.io');
  const [currency, setCurrency] = useState('USD');
  const [trialDays, setTrialDays] = useState('14');

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerToast('Configuración general guardada exitosamente', 'success');
  };

  const handleCopyKey = (prefix: string) => {
    navigator.clipboard?.writeText(prefix);
    onTriggerToast(`Token ${prefix} copiado al portapapeles`, 'success');
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: `pk_live_${randomSuffix}...8a9f`,
      createdAt: 'Hoy',
      lastUsed: 'Recién creada',
    };

    setApiKeys([newKey, ...apiKeys]);
    onTriggerToast(`API Key "${newKeyName}" creada correctamente`, 'success');
    setNewKeyName('');
    setShowKeyModal(false);
  };

  const handleRevokeKey = (id: string, name: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    onTriggerToast(`API Key "${name}" revocada`, 'info');
  };

  const handleTestWebhook = () => {
    onTriggerToast('Ping de webhook enviado. Código 200 OK recibido.', 'success');
  };

  return (
    <div className="settings-container">
      <div className="section-header">
        <div>
          <h1 className="section-title">Configuración del SaaS & API</h1>
          <p className="section-desc">
            Ajustes generales de la aplicación, credenciales seguras de API y webhooks.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* General SaaS configuration */}
        <div className="settings-card">
          <div className="card-header-flex">
            <Globe size={18} className="text-accent" />
            <h2 className="card-title">Parámetros Generales de la Aplicación</h2>
          </div>

          <form onSubmit={handleSaveGeneral} className="settings-form">
            <div className="form-group">
              <label className="form-label">Nombre del SaaS / Marca</label>
              <input
                type="text"
                value={saasName}
                onChange={(e) => setSaasName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correo de Soporte Oficial</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Moneda de Facturación</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="form-input"
                >
                  <option value="USD">USD ($ - Dólar Americano)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="COP">COP ($ - Peso Colombiano)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Días de Prueba Gratis</label>
                <input
                  type="number"
                  value={trialDays}
                  onChange={(e) => setTrialDays(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary self-start">
              <Save size={15} />
              <span>Guardar Cambios</span>
            </button>
          </form>
        </div>

        {/* Security & System Info */}
        <div className="settings-card">
          <div className="card-header-flex">
            <Lock size={18} className="text-success" />
            <h2 className="card-title">Seguridad & Cumplimiento</h2>
          </div>

          <div className="security-list">
            <div className="security-item">
              <div>
                <div className="security-name">Cifrado de Extremo a Extremo</div>
                <div className="security-sub">TLS 1.3 con certificados SSL Let's Encrypt</div>
              </div>
              <span className="badge-status status-active">Activo</span>
            </div>

            <div className="security-item">
              <div>
                <div className="security-name">Autenticación Multifactor (2FA)</div>
                <div className="security-sub">Requerido para administradores con rol SuperAdmin</div>
              </div>
              <span className="badge-status status-active">Forzado</span>
            </div>

            <div className="security-item">
              <div>
                <div className="security-name">Base de Datos PostgreSQL</div>
                <div className="security-sub">Pool de conexiones activas • Réplica de lectura</div>
              </div>
              <span className="badge-status status-active">Conectado</span>
            </div>
          </div>

          <div className="webhook-box">
            <div className="font-semibold text-sm mb-1">Simulador de Webhooks de Eventos</div>
            <p className="text-secondary text-xs mb-3">
              Prueba la respuesta HTTP enviando un evento sintético de suscripción.
            </p>
            <button
              type="button"
              onClick={handleTestWebhook}
              className="btn-secondary w-full justify-center"
            >
              <Send size={14} />
              <span>Enviar Webhook de Prueba</span>
            </button>
          </div>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="table-card mt-6">
        <div className="billing-table-toolbar">
          <div className="toolbar-left">
            <Key size={18} className="text-accent" />
            <div>
              <span className="font-semibold">Claves de API Públicas / Privadas</span>
              <p className="text-secondary text-xs">
                Úsalas para integrar tu SaaS con APIs externas, microservicios y pipelines.
              </p>
            </div>
          </div>
          <button onClick={() => setShowKeyModal(true)} className="btn-primary">
            <Plus size={15} />
            <span>Generar Nueva Clave</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Nombre del Servicio</th>
                <th>Token / Prefijo</th>
                <th>Fecha de Creación</th>
                <th>Último Uso</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id}>
                  <td className="font-medium">{key.name}</td>
                  <td>
                    <div className="api-key-badge">
                      <code>{key.prefix}</code>
                      <button
                        onClick={() => handleCopyKey(key.prefix)}
                        className="copy-btn"
                        title="Copiar token"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="text-secondary">{key.createdAt}</td>
                  <td className="text-muted">{key.lastUsed}</td>
                  <td className="text-right">
                    <button
                      onClick={() => handleRevokeKey(key.id, key.name)}
                      className="btn-danger-icon"
                      title="Revocar clave"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Key Modal */}
      {showKeyModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Generar Nueva Clave de API</h3>
              <button onClick={() => setShowKeyModal(false)} className="modal-close">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateKey} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nombre descriptivo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Zapier Integration Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="form-input"
                />
              </div>
              <p className="text-xs text-secondary">
                La clave se generará con permisos de lectura y escritura para endpoints autorizados.
              </p>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Generar Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
