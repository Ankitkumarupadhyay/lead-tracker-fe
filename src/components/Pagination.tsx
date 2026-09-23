import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLimitChange,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination-bar">
      <div className="pagination-summary">
        Showing <span className="font-semibold">{startItem}</span> to{' '}
        <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{totalItems}</span> leads
      </div>

      <div className="pagination-controls">
        <div className="items-per-page-select">
          <label htmlFor="limit-select">Per page:</label>
          <select
            id="limit-select"
            value={itemsPerPage}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            aria-label="Items per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="page-buttons">
          <button
            type="button"
            className="btn btn-pagination"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Prev</span>
          </button>

          <span className="page-indicator">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            className="btn btn-pagination"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <span>Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
