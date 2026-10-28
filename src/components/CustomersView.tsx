import React, { useState } from 'react';
import {
  UserPlus,
  Filter,
  MoreVertical,
  Check,
  XCircle,
  Building,
  Mail,
  Calendar,
  X,
  CreditCard,
} from 'lucide-react';
import type { Customer, CustomerStatus, PlanType } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  searchTerm: string;
  onAddCustomer: (newCustomer: Omit<Customer, 'id' | 'signupDate'>) => void;
  onUpdateStatus: (customerId: string, status: CustomerStatus) => void;
  onDeleteCustomer: (customerId: string) => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info') => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  searchTerm,
  onAddCustomer,
  onUpdateStatus,
  onDeleteCustomer,
  onTriggerToast,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerStatus>('all');
  const [planFilter, setPlanFilter] = useState<'all' | PlanType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPlan, setNewPlan] = useState<PlanType>('Pro');
  const [newStatus, setNewStatus] = useState<CustomerStatus>('active');

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPlan = planFilter === 'all' || c.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newCompany.trim()) {
      onTriggerToast('Por favor completa todos los campos requeridos', 'info');
      return;
    }

    const planPrices: Record<PlanType, number> = {
      Starter: 49,
      Pro: 149,
      Enterprise: 499,
    };

    onAddCustomer({
      name: newName,
      email: newEmail,
      company: newCompany,
      plan: newPlan,
      status: newStatus,
      mrr: planPrices[newPlan],
    });

    onTriggerToast(`Cliente ${newCompany} agregado exitosamente`, 'success');
    setIsModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewCompany('');
  };

  return (
    <div className="customers-container">
      {/* Top Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Gestión de Suscriptores & Clientes</h1>
          <p className="section-desc">
            Administra planes, estados de facturación y altas de nuevas empresas en el SaaS.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <UserPlus size={16} />
          <span>Nuevo Suscriptor</span>
        </button>
      </div>

      {/* Filter and control bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <span className="filter-label">Estado:</span>
          {(['all', 'active', 'trial', 'past_due', 'canceled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`filter-btn ${statusFilter === st ? 'filter-btn-active' : ''}`}
            >
              {st === 'all'
                ? 'Todos'
                : st === 'active'
                ? 'Activos'
                : st === 'trial'
                ? 'En Prueba'
                : st === 'past_due'
                ? 'Mora'
                : 'Cancelados'}
            </button>
          ))}
        </div>

        <div className="plan-filter-dropdown">
          <label className="text-secondary text-sm">Filtrar Plan:</label>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as 'all' | PlanType)}
            className="custom-select"
          >
            <option value="all">Todos los planes</option>
            <option value="Starter">Starter ($49)</option>
            <option value="Pro">Pro ($149)</option>
            <option value="Enterprise">Enterprise ($499+)</option>
          </select>
        </div>
      </div>

      {/* Results summary stats */}
      <div className="results-summary">
        <span>Mostrando <strong>{filteredCustomers.length}</strong> de {customers.length} suscripciones</span>
        <span className="results-mrr">
          MRR conjunto filtrado: <strong>${filteredCustomers.reduce((acc, c) => acc + c.mrr, 0)} USD/mes</strong>
        </span>
      </div>

      {/* Customers Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Cliente / Empresa</th>
                <th>Plan Activo</th>
                <th>Estado</th>
                <th>MRR</th>
                <th>Fecha de Alta</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No se encontraron clientes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {cust.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="customer-name">{cust.name}</div>
                          <div className="customer-company">
                            <Building size={12} />
                            <span>{cust.company}</span>
                          </div>
                          <div className="customer-email">
                            <Mail size={12} />
                            <span>{cust.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge-plan badge-plan-${cust.plan.toLowerCase()}`}
                      >
                        {cust.plan}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status status-${cust.status}`}>
                        {cust.status === 'active'
                          ? 'Activo'
                          : cust.status === 'trial'
                          ? 'En Prueba'
                          : cust.status === 'past_due'
                          ? 'Mora'
                          : 'Cancelado'}
                      </span>
                    </td>
                    <td className="font-semibold">${cust.mrr} USD/mes</td>
                    <td className="text-muted">
                      <div className="date-cell">
                        <Calendar size={13} />
                        <span>{cust.signupDate}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="relative-container inline-block">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === cust.id ? null : cust.id)
                          }
                          className="action-menu-btn"
                          title="Opciones"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeMenuId === cust.id && (
                          <div className="action-popover">
                            <div className="popover-header">Cambiar Estado</div>
                            <button
                              onClick={() => {
                                onUpdateStatus(cust.id, 'active');
                                setActiveMenuId(null);
                                onTriggerToast('Estado actualizado a Activo', 'success');
                              }}
                              className="popover-item text-success"
                            >
                              <Check size={14} />
                              <span>Marcar Activo</span>
                            </button>
                            <button
                              onClick={() => {
                                onUpdateStatus(cust.id, 'canceled');
                                setActiveMenuId(null);
                                onTriggerToast('Suscripción marcada como Cancelada', 'info');
                              }}
                              className="popover-item text-danger"
                            >
                              <XCircle size={14} />
                              <span>Cancelar Plan</span>
                            </button>
                            <div className="popover-divider" />
                            <button
                              onClick={() => {
                                onDeleteCustomer(cust.id);
                                setActiveMenuId(null);
                                onTriggerToast('Cliente eliminado del sistema', 'info');
                              }}
                              className="popover-item text-danger"
                            >
                              Eliminar registro
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar Nuevo Cliente */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-accent" />
                <h3 className="modal-title">Registrar Nuevo Suscriptor</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nombre del Contacto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Morales"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo Corporativo</label>
                <input
                  type="email"
                  required
                  placeholder="Ej: laura@empresa.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nombre de la Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Nexora Tech Labs"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Nivel de Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as PlanType)}
                    className="form-input"
                  >
                    <option value="Starter">Starter ($49/mes)</option>
                    <option value="Pro">Pro ($149/mes)</option>
                    <option value="Enterprise">Enterprise ($499/mes)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Estado Inicial</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as CustomerStatus)}
                    className="form-input"
                  >
                    <option value="active">Activo Inmediato</option>
                    <option value="trial">Prueba Gratuita (14 días)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Suscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
