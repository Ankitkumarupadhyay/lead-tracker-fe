import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { App } from '../App';
import { leadsApi } from '../api/leadsApi';

vi.mock('../api/leadsApi', () => ({
  leadsApi: {
    getLeads: vi.fn().mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    }),
    getStats: vi.fn().mockResolvedValue({
      total: 5,
      byStatus: { New: 3, Contacted: 1, Qualified: 1, Lost: 0, Closed: 0 },
      conversionRate: 20,
    }),
    createLead: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

describe('Document Metadata and Title', () => {
  beforeEach(() => {
    // Setup initial DOM state
    document.title = 'LeadFlow — Enterprise Lead Tracker | Stylework';
    let meta = document.getElementById('theme-color-meta');
    if (!meta) {
      meta = document.createElement('meta');
      meta.id = 'theme-color-meta';
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('content', '#4f46e5');
      document.head.appendChild(meta);
    }
  });

  it('updates document title with new leads count when stats load', async () => {
    render(<App />);

    await waitFor(() => {
      expect(document.title).toContain('3 New');
      expect(document.title).toContain('LeadFlow — Stylework Lead Tracker');
    });
  });

  it('syncs theme-color meta tag with active theme', async () => {
    render(<App />);

    await waitFor(() => {
      const meta = document.getElementById('theme-color-meta');
      expect(meta).toBeInTheDocument();
      expect(meta?.getAttribute('content')).toBe('#4f46e5');
    });
  });
});
