import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export type TabType = 'overview' | 'customers' | 'billing' | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  customerCount: number;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  customerCount,
  isOpen,
  onCloseMobile,
}) => {
  const menuItems = [
    {
      id: 'overview' as TabType,
      label: 'Resumen & KPIs',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'customers' as TabType,
      label: 'Suscripciones',
      icon: Users,
      badge: customerCount,
    },
    {
      id: 'billing' as TabType,
      label: 'Facturación',
      icon: CreditCard,
      badge: null,
    },
    {
      id: 'settings' as TabType,
      label: 'Configuración & API',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}

      <aside className={`sidebar-container ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand header */}
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <Sparkles size={20} className="brand-sparkle" />
          </div>
          <div className="brand-text">
            <div className="brand-name">AuraSaaS</div>
            <span className="brand-sub">Admin Hub</span>
          </div>
          <span className="badge-prod">v1.2</span>
        </div>

        {/* Quick environment indicator */}
        <div className="env-pill">
          <span className="status-dot-pulse" />
          <span className="env-label">Producción • AWS US-East</span>
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          <div className="nav-group-title">Módulos Principales</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <div className="nav-item-left">
                  <Icon size={19} className="nav-icon" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="nav-badge">{item.badge}</span>
                )}
                {isActive && <ChevronRight size={15} className="nav-arrow" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom promo / developer link */}
        <div className="sidebar-footer">
          <div className="footer-card">
            <div className="footer-title">Repositorio en GitHub</div>
            <p className="footer-desc">
              Código limpio, TypeScript, React y arquitectura modular.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="footer-github-link"
            >
              <span>Ver en GitHub</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="user-profile-bar">
            <div className="avatar-circle">VO</div>
            <div className="user-info">
              <span className="user-name">Viviana Ocampo</span>
              <span className="user-role">SaaS Admin / Lead Dev</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
