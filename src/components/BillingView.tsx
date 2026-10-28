import React, { useState } from 'react';
import {
  FileText,
  Download,
  AlertTriangle,
  Receipt,
  CreditCard,
  Building2,
} from 'lucide-react';
import type { Invoice, InvoiceStatus } from '../types';

interface BillingViewProps {
  invoices: Invoice[];
  onTriggerToast: (msg: string, type?: 'success' | 'info') => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  invoices,
  onTriggerToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | InvoiceStatus>('all');

  const filteredInvoices = invoices.filter((inv) =>
    filterStatus === 'all' ? true : inv.status === filterStatus
  );

  const totalCollected = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handleDownload = (invoiceNum: string) => {
    onTriggerToast(`Descargando comprobante fiscal ${invoiceNum}.pdf`, 'success');
  };

  return (
    <div className="billing-container">
      {/* Top Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Facturación & Pasarela de Pagos</h1>
          <p className="section-desc">
            Conciliación de pagos recurrentes, generación de facturas y estado del gateway.
          </p>
        </div>
      </div>

      {/* Gateway status & Quick KPI banner */}
      <div className="billing-cards-grid">
        <div className="billing-stat-card">
          <div className="billing-stat-header">
            <span className="text-secondary text-sm">Recaudación este ciclo</span>
            <Receipt size={18} className="text-accent" />
          </div>
          <div className="billing-stat-value">${totalCollected.toLocaleString()} USD</div>
          <div className="text-muted text-xs">Corte al 28 de Febrero 2026</div>
        </div>

        <div className="billing-stat-card">
          <div className="billing-stat-header">
            <span className="text-secondary text-sm">Pasarela Principal</span>
            <CreditCard size={18} className="text-success" />
          </div>
          <div className="billing-stat-value flex items-center gap-2">
            <span>Stripe Connect</span>
            <span className="badge-status status-active">Online</span>
          </div>
          <div className="text-muted text-xs">Latencia API: 142ms • Webhooks OK</div>
        </div>

        <div className="billing-stat-card">
          <div className="billing-stat-header">
            <span className="text-secondary text-sm">Cobros Fallidos / Dunning</span>
            <AlertTriangle size={18} className="text-danger" />
          </div>
          <div className="billing-stat-value text-danger">1 Factura pendiente</div>
          <div className="text-muted text-xs">Reintentos automáticos Smart Retries activos</div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="table-card">
        <div className="billing-table-toolbar">
          <div className="toolbar-left">
            <FileText size={18} className="text-secondary" />
            <span className="font-semibold">Historial de Facturas Emitidas</span>
          </div>

          <div className="filter-group">
            <button
              onClick={() => setFilterStatus('all')}
              className={`filter-btn ${filterStatus === 'all' ? 'filter-btn-active' : ''}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`filter-btn ${filterStatus === 'paid' ? 'filter-btn-active' : ''}`}
            >
              Pagadas
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`filter-btn ${filterStatus === 'pending' ? 'filter-btn-active' : ''}`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilterStatus('failed')}
              className={`filter-btn ${filterStatus === 'failed' ? 'filter-btn-active' : ''}`}
            >
              Fallidas
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>No. Factura</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha Emisión</th>
                <th>Vencimiento</th>
                <th className="text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-mono font-medium text-accent">
                    {inv.invoiceNumber}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-muted" />
                      <span className="font-medium">{inv.customerName}</span>
                    </div>
                  </td>
                  <td className="font-semibold">${inv.amount} USD</td>
                  <td>
                    <span
                      className={`badge-status ${
                        inv.status === 'paid'
                          ? 'status-active'
                          : inv.status === 'pending'
                          ? 'status-trial'
                          : 'status-canceled'
                      }`}
                    >
                      {inv.status === 'paid'
                        ? 'Pagada'
                        : inv.status === 'pending'
                        ? 'Pendiente'
                        : 'Fallida'}
                    </span>
                  </td>
                  <td className="text-secondary">{inv.date}</td>
                  <td className="text-muted">{inv.dueDate}</td>
                  <td className="text-right">
                    <button
                      onClick={() => handleDownload(inv.invoiceNumber)}
                      className="btn-icon-table"
                      title="Descargar PDF"
                    >
                      <Download size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
