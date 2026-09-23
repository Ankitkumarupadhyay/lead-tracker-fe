export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Closed';

export const LEAD_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Qualified',
  'Lost',
  'Closed',
];

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

export interface UpdateLeadStatusPayload {
  status: LeadStatus;
}

export interface QueryLeadParams {
  q?: string;
  status?: LeadStatus | '';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedLeadsResponse {
  data: Lead[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  conversionRate: number;
}
