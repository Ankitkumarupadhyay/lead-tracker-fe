import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { LeadStatus } from '../types/lead';

describe('StatusBadge', () => {
  it('renders correct status label and class for Qualified status', () => {
    render(<StatusBadge status="Qualified" />);
    const badge = screen.getByText('Qualified');
    expect(badge).toBeInTheDocument();
    expect(badge.closest('.status-badge')).toHaveClass('status-badge-qualified');
  });

  it('renders correct class for all statuses', () => {
    const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost', 'Closed'];
    statuses.forEach((st) => {
      const { unmount } = render(<StatusBadge status={st} />);
      const badge = screen.getByText(st);
      expect(badge).toBeInTheDocument();
      expect(badge.closest('.status-badge')).toHaveClass(`status-badge-${st.toLowerCase()}`);
      unmount();
    });
  });
});
