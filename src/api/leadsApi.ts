import type {
  CreateLeadPayload,
  Lead,
  LeadStats,
  PaginatedLeadsResponse,
  QueryLeadParams,
  UpdateLeadStatusPayload,
} from '../types/lead';

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(
    /\/$/,
    '',
  ) + '/api';

class ApiError extends Error {
  statusCode?: number;
  messages?: string[];

  constructor(message: string, statusCode?: number, messages?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.messages = messages;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    let errorDetails: string[] | undefined;

    try {
      const errorData = await response.json();
      if (Array.isArray(errorData.message)) {
        errorDetails = errorData.message;
        errorMessage = errorData.message.join(', ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // response wasn't JSON
    }

    throw new ApiError(errorMessage, response.status, errorDetails);
  }

  return response.json();
}

export const leadsApi = {
  /**
   * Fetch paginated leads with optional search and filters
   */
  async getLeads(params: QueryLeadParams = {}): Promise<PaginatedLeadsResponse> {
    const url = new URL(`${BASE_URL}/leads`);

    if (params.q?.trim()) {
      url.searchParams.set('q', params.q.trim());
    }
    if (params.status) {
      url.searchParams.set('status', params.status);
    }
    if (params.page) {
      url.searchParams.set('page', params.page.toString());
    }
    if (params.limit) {
      url.searchParams.set('limit', params.limit.toString());
    }
    if (params.sortBy) {
      url.searchParams.set('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      url.searchParams.set('sortOrder', params.sortOrder);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    return handleResponse<PaginatedLeadsResponse>(response);
  },

  /**
   * Fetch aggregate lead statistics
   */
  async getStats(): Promise<LeadStats> {
    const response = await fetch(`${BASE_URL}/leads/stats`, {
      headers: {
        Accept: 'application/json',
      },
    });

    return handleResponse<LeadStats>(response);
  },

  /**
   * Create a new lead
   */
  async createLead(payload: CreateLeadPayload): Promise<Lead> {
    const response = await fetch(`${BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<Lead>(response);
  },

  /**
   * Update the status of a lead
   */
  async updateStatus(
    id: string,
    payload: UpdateLeadStatusPayload,
  ): Promise<Lead> {
    const response = await fetch(`${BASE_URL}/leads/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<Lead>(response);
  },
};
