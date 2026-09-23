import React from 'react';
import { LEAD_STATUSES, type Lead, type LeadStatus } from '../types/lead';
import { StatusBadge } from './StatusBadge';
import { LoadingSkeleton } from './LoadingSkeleton';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => Promise<void>;
  updatingLeadId: string | null;
  onOpenCreateModal: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  onUpdateStatus,
  updatingLeadId,
  onOpenCreateModal,
  hasFilters,
  onClearFilters,
}) => {
  const formatDate = (isoString: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  if (isLoading && leads.length === 0) {
    return <LoadingSkeleton />;
  }

  if (leads.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrapper">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <h3 className="empty-title">No leads found</h3>
        <p className="empty-description">
          {hasFilters
            ? 'No leads match your current search query or status filter.'
            : 'Your pipeline is currently empty. Get started by adding your first lead!'}
        </p>
        <div className="empty-actions">
          {hasFilters ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClearFilters}
            >
              Clear Filters
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenCreateModal}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Your First Lead</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-responsive-container">
      {/* Desktop Table View */}
      <table className="leads-table" aria-label="Leads list">
        <thead>
          <tr>
            <th scope="col" className="th-lead">Lead</th>
            <th scope="col" className="th-contact">Contact Details</th>
            <th scope="col" className="th-status">Status & Pipeline Stage</th>
            <th scope="col" className="th-created">Created At</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const isUpdating = updatingLeadId === lead._id;
            return (
              <tr key={lead._id} className="lead-row">
                <td className="td-lead">
                  <div className="lead-name-cell">
                    <div className="lead-avatar" aria-hidden="true">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="lead-info">
                      <span className="lead-name">{lead.name}</span>
                      <span className="lead-id-sub">ID: {lead._id.slice(-6)}</span>
                    </div>
                  </div>
                </td>

                <td className="td-contact">
                  <div className="contact-details">
                    <a
                      href={`mailto:${lead.email}`}
                      className="contact-link email-link"
                      title={`Send email to ${lead.email}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>{lead.email}</span>
                    </a>
                    <a
                      href={`tel:${lead.phone}`}
                      className="contact-link phone-link"
                      title={`Call ${lead.phone}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>{lead.phone}</span>
                    </a>
                  </div>
                </td>

                <td className="td-status">
                  <div className="status-cell-wrapper">
                    <div className="status-interactive">
                      <StatusBadge status={lead.status} />
                      <div className="status-dropdown-wrap">
                        <select
                          className="status-quick-select"
                          value={lead.status}
                          disabled={isUpdating}
                          onChange={(e) =>
                            onUpdateStatus(lead._id, e.target.value as LeadStatus)
                          }
                          aria-label={`Change status for ${lead.name}`}
                        >
                          {LEAD_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              Move to: {st}
                            </option>
                          ))}
                        </select>
                        {isUpdating && <span className="spinner-inline" />}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="td-created">
                  <span className="created-date" title={lead.createdAt}>
                    {formatDate(lead.createdAt)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile Card List View */}
      <div className="mobile-cards-list">
        {leads.map((lead) => {
          const isUpdating = updatingLeadId === lead._id;
          return (
            <div key={lead._id} className="lead-mobile-card">
              <div className="mobile-card-header">
                <div className="lead-avatar" aria-hidden="true">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div className="mobile-card-title">
                  <h4 className="mobile-lead-name">{lead.name}</h4>
                  <span className="mobile-lead-date">{formatDate(lead.createdAt)}</span>
                </div>
              </div>

              <div className="mobile-card-contacts">
                <a href={`mailto:${lead.email}`} className="contact-link email-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>{lead.email}</span>
                </a>
                <a href={`tel:${lead.phone}`} className="contact-link phone-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{lead.phone}</span>
                </a>
              </div>

              <div className="mobile-card-footer">
                <StatusBadge status={lead.status} size="sm" />
                <div className="status-dropdown-wrap">
                  <select
                    className="status-quick-select"
                    value={lead.status}
                    disabled={isUpdating}
                    onChange={(e) =>
                      onUpdateStatus(lead._id, e.target.value as LeadStatus)
                    }
                    aria-label={`Change status for ${lead.name}`}
                  >
                    {LEAD_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        Move to: {st}
                      </option>
                    ))}
                  </select>
                  {isUpdating && <span className="spinner-inline" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
