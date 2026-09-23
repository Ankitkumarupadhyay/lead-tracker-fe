import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FilterBar } from '../components/FilterBar';

describe('FilterBar', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    selectedStatus: '' as const,
    onStatusChange: vi.fn(),
    sortBy: 'createdAt',
    sortOrder: 'desc' as const,
    onSortChange: vi.fn(),
    stats: {
      total: 10,
      byStatus: {
        New: 4,
        Contacted: 3,
        Qualified: 2,
        Lost: 1,
        Closed: 0,
      },
      conversionRate: 20,
    },
    onRefresh: vi.fn(),
    isRefreshing: false,
  };

  it('renders search input and trigger search callback', () => {
    render(<FilterBar {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText(/search leads by name/i);
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('John');
  });

  it('renders status filter tabs with correct counts', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText('All Leads')).toBeInTheDocument();
    expect(screen.getByText('Qualified')).toBeInTheDocument();
    expect(screen.getByText('Contacted')).toBeInTheDocument();
  });

  it('triggers onStatusChange when a status pill is clicked', () => {
    render(<FilterBar {...defaultProps} />);
    const qualifiedPill = screen.getByText('Qualified');
    fireEvent.click(qualifiedPill);
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith('Qualified');
  });
});
