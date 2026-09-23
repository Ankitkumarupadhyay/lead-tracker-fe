import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { CreateLeadModal } from '../components/CreateLeadModal';

describe('CreateLeadModal', () => {
  it('renders form inputs when modal is open', () => {
    render(
      <CreateLeadModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save lead/i })).toBeInTheDocument();
  });

  it('validates required fields before submitting', async () => {
    const mockSubmit = vi.fn();
    render(
      <CreateLeadModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={mockSubmit}
      />,
    );

    const submitBtn = screen.getByRole('button', { name: /save lead/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits valid data', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    const mockClose = vi.fn();

    render(
      <CreateLeadModal
        isOpen={true}
        onClose={mockClose}
        onSubmit={mockSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Sara Connor' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'sara@cyberdyne.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '+1234567890' },
    });

    const submitBtn = screen.getByRole('button', { name: /save lead/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Sara Connor',
        email: 'sara@cyberdyne.com',
        phone: '+1234567890',
        status: 'New',
      });
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
