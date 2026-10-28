import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  RefreshCw,
  CheckCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { ActivityItem } from '../types';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  activities: ActivityItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  activities,
  searchTerm,
  onSearchChange,
  onRefresh,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>

        <div className="search-bar">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar clientes, correos, facturas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="clear-search-btn"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Refresh button */}
        <button
          onClick={handleRefreshClick}
          className="header-icon-btn"
          title="Actualizar datos"
        >
          <RefreshCw size={17} className={isRefreshing ? 'spin-anim' : ''} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="header-icon-btn"
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications menu */}
        <div className="relative-container">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="header-icon-btn"
            title="Notificaciones"
          >
            <Bell size={18} />
            <span className="notif-badge">{activities.length}</span>
          </button>

          {showNotifications && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <div className="notif-title-box">
                  <span className="notif-title">Actividad Reciente</span>
                  <span className="notif-count">{activities.length} nuevos</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="notif-mark-read"
                >
                  <CheckCheck size={14} />
                  <span>Cerrar</span>
                </button>
              </div>

              <div className="notif-list">
                {activities.map((act) => (
                  <div key={act.id} className="notif-item">
                    <div className="notif-item-title">{act.title}</div>
                    <div className="notif-item-desc">{act.description}</div>
                    <div className="notif-item-time">{act.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live system status indicator */}
        <div className="header-status-badge">
          <span className="status-ping" />
          <span className="status-text">SaaS Online</span>
        </div>
      </div>
    </header>
  );
};
