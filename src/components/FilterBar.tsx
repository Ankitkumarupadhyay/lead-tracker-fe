import React from 'react';
import { LEAD_STATUSES, type LeadStats, type LeadStatus } from '../types/lead';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: LeadStatus | '';
  onStatusChange: (status: LeadStatus | '') => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  stats: LeadStats | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  sortOrder,
  onSortChange,
  stats,
  onRefresh,
  isRefreshing,
}) => {
  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'createdAt-desc') onSortChange('createdAt', 'desc');
    else if (val === 'createdAt-asc') onSortChange('createdAt', 'asc');
    else if (val === 'name-asc') onSortChange('name', 'asc');
    else if (val === 'name-desc') onSortChange('name', 'desc');
  };

  const currentSortVal = `${sortBy}-${sortOrder}`;

  return (
    <div className="filter-bar">
      <div className="filter-top-row">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search leads by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search leads"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Sort & Refresh controls */}
        <div className="filter-controls">
          <div className="select-wrapper">
            <select
              className="sort-select"
              value={currentSortVal}
              onChange={handleSortSelect}
              aria-label="Sort leads by"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-refresh"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh leads list"
            aria-label="Refresh leads list"
          >
            <svg
              className={`refresh-icon ${isRefreshing ? 'icon-spin' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="status-pills-row" role="tablist" aria-label="Filter by lead status">
        <button
          type="button"
          role="tab"
          aria-selected={selectedStatus === ''}
          className={`status-pill ${selectedStatus === '' ? 'status-pill-active' : ''}`}
          onClick={() => onStatusChange('')}
        >
          All Leads
          <span className="pill-count">{stats?.total ?? 0}</span>
        </button>

        {LEAD_STATUSES.map((status) => {
          const count = stats?.byStatus?.[status] ?? 0;
          const isActive = selectedStatus === status;
          return (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`status-pill status-pill-${status.toLowerCase()} ${
                isActive ? 'status-pill-active' : ''
              }`}
              onClick={() => onStatusChange(status)}
            >
              {status}
              <span className="pill-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
