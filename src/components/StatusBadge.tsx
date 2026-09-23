import React from 'react';
import type { LeadStatus } from '../types/lead';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const getStatusClass = (st: LeadStatus) => {
    switch (st) {
      case 'New':
        return 'status-badge-new';
      case 'Contacted':
        return 'status-badge-contacted';
      case 'Qualified':
        return 'status-badge-qualified';
      case 'Lost':
        return 'status-badge-lost';
      case 'Closed':
        return 'status-badge-closed';
      default:
        return 'status-badge-default';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)} status-badge-${size}`}>
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  );
};
