import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="skeleton-table-wrapper" aria-label="Loading content">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-cell skeleton-avatar" />
          <div className="skeleton-cell skeleton-text-lg" />
          <div className="skeleton-cell skeleton-text-md" />
          <div className="skeleton-cell skeleton-text-sm" />
          <div className="skeleton-cell skeleton-badge" />
        </div>
      ))}
    </div>
  );
};
