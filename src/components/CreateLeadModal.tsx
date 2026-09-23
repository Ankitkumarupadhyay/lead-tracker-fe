import React, { useEffect, useState } from 'react';
import { LEAD_STATUSES, type CreateLeadPayload, type LeadStatus } from '../types/lead';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeadPayload) => Promise<void>;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<LeadStatus>('New');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPhone('');
      setStatus('New');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        status,
      });
      onClose();
    } catch (err) {
      // Error handled by parent toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <div>
              <h3 id="modal-title" className="modal-title">Create New Lead</h3>
              <p className="modal-subtitle">Add a prospect to your sales qualification pipeline</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="lead-name" className="form-label">
              Full Name <span className="required-star">*</span>
            </label>
            <input
              id="lead-name"
              type="text"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="lead-email" className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              id="lead-email"
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="e.g. alex.morgan@enterprise.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="lead-phone" className="form-label">
              Phone Number <span className="required-star">*</span>
            </label>
            <input
              id="lead-phone"
              type="tel"
              className={`form-input ${errors.phone ? 'input-error' : ''}`}
              placeholder="e.g. +1 (555) 234-5678"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              disabled={isSubmitting}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* Status Field */}
          <div className="form-group">
            <label htmlFor="lead-status" className="form-label">
              Initial Pipeline Status
            </label>
            <div className="select-wrapper">
              <select
                id="lead-status"
                className="form-input form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                disabled={isSubmitting}
              >
                {LEAD_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-submit-lead"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-sm" />
                  <span>Creating Lead...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Save Lead</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
