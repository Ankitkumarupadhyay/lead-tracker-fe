import React from 'react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  isBackendHealthy: boolean | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  isBackendHealthy,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 18 13 22 9" />
            </svg>
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">LeadFlow</h1>
              <span className="brand-badge">Stylework</span>
            </div>
            <p className="brand-subtitle">
              Enterprise Lead Management & Qualification Tracker
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div
            className={`api-status-indicator ${
              isBackendHealthy === true
                ? 'status-online'
                : isBackendHealthy === false
                ? 'status-offline'
                : 'status-checking'
            }`}
            title={
              isBackendHealthy === true
                ? 'Backend connected'
                : isBackendHealthy === false
                ? 'Backend unreachable'
                : 'Connecting to API...'
            }
          >
            <span className="status-ping" />
            <span className="status-label">
              {isBackendHealthy === true
                ? 'API Online'
                : isBackendHealthy === false
                ? 'API Offline'
                : 'Connecting'}
            </span>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-add-lead"
            onClick={onOpenCreateModal}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Lead</span>
          </button>
        </div>
      </div>
    </header>
  );
};
