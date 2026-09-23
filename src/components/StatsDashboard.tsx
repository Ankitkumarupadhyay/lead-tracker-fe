import React from 'react';
import type { LeadStats, LeadStatus } from '../types/lead';

interface StatsDashboardProps {
  stats: LeadStats | null;
  activeStatus: LeadStatus | '';
  onSelectStatus: (status: LeadStatus | '') => void;
  isLoading: boolean;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  activeStatus,
  onSelectStatus,
  isLoading,
}) => {
  if (isLoading && !stats) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="stat-card skeleton-stat-card" />
        ))}
      </div>
    );
  }

  const total = stats?.total || 0;
  const newCount = stats?.byStatus?.['New'] || 0;
  const contactedCount = stats?.byStatus?.['Contacted'] || 0;
  const qualifiedCount = stats?.byStatus?.['Qualified'] || 0;
  const closedCount = stats?.byStatus?.['Closed'] || 0;
  const conversionRate = stats?.conversionRate || 0;

  return (
    <section className="stats-dashboard" aria-label="Lead performance statistics">
      <div className="stats-grid">
        <button
          type="button"
          className={`stat-card stat-card-total ${activeStatus === '' ? 'stat-card-active' : ''}`}
          onClick={() => onSelectStatus('')}
        >
          <div className="stat-icon-wrapper total-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-label">Total Leads</span>
            <span className="stat-value">{total}</span>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card stat-card-new ${activeStatus === 'New' ? 'stat-card-active' : ''}`}
          onClick={() => onSelectStatus('New')}
        >
          <div className="stat-icon-wrapper new-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-label">New Leads</span>
            <span className="stat-value">{newCount}</span>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card stat-card-contacted ${activeStatus === 'Contacted' ? 'stat-card-active' : ''}`}
          onClick={() => onSelectStatus('Contacted')}
        >
          <div className="stat-icon-wrapper contacted-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-label">Contacted</span>
            <span className="stat-value">{contactedCount}</span>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card stat-card-qualified ${activeStatus === 'Qualified' ? 'stat-card-active' : ''}`}
          onClick={() => onSelectStatus('Qualified')}
        >
          <div className="stat-icon-wrapper qualified-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-label">Qualified</span>
            <span className="stat-value">{qualifiedCount}</span>
          </div>
        </button>

        <div className="stat-card stat-card-conversion">
          <div className="stat-icon-wrapper conversion-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-label">Conversion Rate</span>
            <div className="conversion-value-wrap">
              <span className="stat-value">{conversionRate}%</span>
              <span className="stat-hint">({qualifiedCount + closedCount} closed/qual.)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
