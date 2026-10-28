import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  TrendingUp,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Download,
  Calendar,
} from 'lucide-react';
import type { Customer, ActivityItem } from '../types';
import { MONTHLY_REVENUE_DATA } from '../data/mockData';

interface OverviewViewProps {
  customers: Customer[];
  activities: ActivityItem[];
  onTriggerToast: (msg: string, type?: 'success' | 'info') => void;
  onNavigateToCustomers: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  customers,
  activities,
  onTriggerToast,
  onNavigateToCustomers,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'6m' | '12m'>('6m');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Compute live KPIs from customers data
  const totalMrr = customers
    .filter((c) => c.status === 'active')
    .reduce((acc, curr) => acc + curr.mrr, 0);

  const activeCustomers = customers.filter((c) => c.status === 'active').length;
  const trialCustomers = customers.filter((c) => c.status === 'trial').length;

  const kpis = [
    {
      title: 'MRR (Ingreso Mensual)',
      value: `$${(totalMrr * 18.5).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      change: 18.4,
      isPositive: true,
      timeframe: 'vs. mes anterior',
      icon: DollarSign,
      color: 'emerald',
    },
    {
      title: 'Suscripciones Activas',
      value: `${activeCustomers * 120 + 240}`,
      change: 12.8,
      isPositive: true,
      timeframe: 'vs. mes anterior',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Tasa de Cancelación (Churn)',
      value: '1.4%',
      change: -0.6,
      isPositive: true, // Lower churn is positive!
      timeframe: 'benchmark < 2.5%',
      icon: Percent,
      color: 'violet',
    },
    {
      title: 'Conversión de Trials',
      value: `${trialCustomers > 0 ? '68.2%' : '65.0%'}`,
      change: 4.2,
      isPositive: true,
      timeframe: 'últimos 30 días',
      icon: TrendingUp,
      color: 'amber',
    },
  ];

  const handleExportCsv = () => {
    onTriggerToast('Reporte ejecutivo CSV exportado con éxito', 'success');
  };

  // Helper for SVG chart
  const maxRevenue = Math.max(...MONTHLY_REVENUE_DATA.map((d) => d.revenue));
  const chartHeight = 180;
  const chartWidth = 550;

  return (
    <div className="overview-container">
      {/* Top Banner / Hero */}
      <div className="overview-hero">
        <div className="hero-text">
          <h1 className="hero-title">Panel Ejecutivo de Operaciones</h1>
          <p className="hero-subtitle">
            Monitoreo en tiempo real de métricas financieras, cohortes de usuarios y salud del SaaS.
          </p>
        </div>
        <div className="hero-actions">
          <button
            onClick={() => setSelectedPeriod(selectedPeriod === '6m' ? '12m' : '6m')}
            className="btn-secondary"
          >
            <Calendar size={15} />
            <span>Periodo: {selectedPeriod === '6m' ? 'Últimos 6 Meses' : 'Año Fiscal'}</span>
          </button>
          <button onClick={handleExportCsv} className="btn-primary">
            <Download size={15} />
            <span>Exportar Métricas</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="kpi-grid">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`kpi-card kpi-border-${kpi.color}`}>
              <div className="kpi-header">
                <span className="kpi-title">{kpi.title}</span>
                <div className={`kpi-icon-badge kpi-badge-${kpi.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-footer">
                <span className={`kpi-trend ${kpi.isPositive ? 'trend-up' : 'trend-down'}`}>
                  {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(kpi.change)}%
                </span>
                <span className="kpi-timeframe">{kpi.timeframe}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Analytics Split */}
      <div className="charts-split-grid">
        {/* Revenue Growth Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Evolución de Ingresos Recurrentes (ARR / MRR)</h2>
              <p className="chart-desc">Crecimiento constante intermensual proyectado</p>
            </div>
            <div className="chart-legend">
              <span className="legend-dot legend-primary" />
              <span>MRR Facturado</span>
            </div>
          </div>

          <div className="svg-chart-wrapper">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
              className="revenue-svg"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.33, 0.66, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1="30"
                  y1={chartHeight * ratio + 10}
                  x2={chartWidth - 20}
                  y2={chartHeight * ratio + 10}
                  stroke="var(--border-subtle)"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area path */}
              <path
                d={
                  `M ${MONTHLY_REVENUE_DATA.map((d, i) => {
                    const x = 50 + i * ((chartWidth - 90) / (MONTHLY_REVENUE_DATA.length - 1));
                    const y = chartHeight - (d.revenue / maxRevenue) * (chartHeight - 40) + 10;
                    return `${x},${y}`;
                  }).join(' L ')} ` +
                  `L ${chartWidth - 40},${chartHeight + 10} L 50,${chartHeight + 10} Z`
                }
                fill="url(#chartGradient)"
              />

              {/* Line path */}
              <path
                d={`M ${MONTHLY_REVENUE_DATA.map((d, i) => {
                  const x = 50 + i * ((chartWidth - 90) / (MONTHLY_REVENUE_DATA.length - 1));
                  const y = chartHeight - (d.revenue / maxRevenue) * (chartHeight - 40) + 10;
                  return `${x},${y}`;
                }).join(' L ')}`}
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & labels */}
              {MONTHLY_REVENUE_DATA.map((d, i) => {
                const x = 50 + i * ((chartWidth - 90) / (MONTHLY_REVENUE_DATA.length - 1));
                const y = chartHeight - (d.revenue / maxRevenue) * (chartHeight - 40) + 10;
                const isHovered = hoveredMonth === i;

                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 7 : 4.5}
                      fill="var(--bg-card)"
                      stroke="var(--accent-primary)"
                      strokeWidth={isHovered ? 3.5 : 2.5}
                      className="chart-dot"
                      onMouseEnter={() => setHoveredMonth(i)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    />
                    <text
                      x={x}
                      y={chartHeight + 30}
                      textAnchor="middle"
                      className="chart-axis-label"
                    >
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>

            {hoveredMonth !== null && (
              <div className="chart-tooltip">
                <span className="tooltip-month">{MONTHLY_REVENUE_DATA[hoveredMonth].month} 2026</span>
                <span className="tooltip-value">
                  ${MONTHLY_REVENUE_DATA[hoveredMonth].revenue.toLocaleString()} USD
                </span>
                <span className="tooltip-sub">
                  {MONTHLY_REVENUE_DATA[hoveredMonth].users} empresas activas
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Plans distribution & Health Status */}
        <div className="summary-card">
          <h2 className="summary-title">Distribución por Planes</h2>
          <p className="summary-desc">Desglose de contratos vigentes</p>

          <div className="plans-breakdown">
            <div className="plan-row">
              <div className="plan-label-row">
                <span className="plan-tag enterprise-tag">Enterprise ($499 - $899)</span>
                <span className="plan-val">54% ($23,100)</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill fill-enterprise" style={{ width: '54%' }} />
              </div>
            </div>

            <div className="plan-row">
              <div className="plan-label-row">
                <span className="plan-tag pro-tag">Pro ($149)</span>
                <span className="plan-val">34% ($14,550)</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill fill-pro" style={{ width: '34%' }} />
              </div>
            </div>

            <div className="plan-row">
              <div className="plan-label-row">
                <span className="plan-tag starter-tag">Starter ($49)</span>
                <span className="plan-val">12% ($5,150)</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill fill-starter" style={{ width: '12%' }} />
              </div>
            </div>
          </div>

          <div className="system-health-box">
            <div className="health-icon">
              <ShieldCheck size={22} />
            </div>
            <div className="health-details">
              <div className="health-title">SLAs de Disponibilidad: 99.98%</div>
              <div className="health-sub">PostgreSQL • Redis Cache • Stripe Webhooks</div>
            </div>
          </div>

          <button onClick={onNavigateToCustomers} className="btn-manage-all">
            <span>Gestionar Todas las Cuentas</span>
            <Zap size={14} />
          </button>
        </div>
      </div>

      {/* Activity Logs & Quick Auditing */}
      <div className="activity-card">
        <div className="activity-header">
          <div>
            <h2 className="activity-title">Auditoría de Eventos Recientes</h2>
            <p className="activity-desc">Registro de cambios de planes, altas y webhooks</p>
          </div>
          <span className="badge-live-feed">Feed en vivo</span>
        </div>

        <div className="activity-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Detalles de la Transacción</th>
                <th>Tiempo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold">{item.title}</td>
                  <td className="text-secondary">{item.description}</td>
                  <td className="text-muted">{item.timestamp}</td>
                  <td>
                    <span
                      className={`badge-status ${
                        item.type === 'upgrade'
                          ? 'status-active'
                          : item.type === 'payment_failed'
                          ? 'status-canceled'
                          : 'status-trial'
                      }`}
                    >
                      {item.type === 'upgrade'
                        ? 'Completado'
                        : item.type === 'payment_failed'
                        ? 'Atención'
                        : 'Info'}
                    </span>
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
