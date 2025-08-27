//const API_BASE = import.meta.env.VITE_APP_USE_MOCK_API ? (import.meta.env.VITE_APP_USE_MOCK_API) : import.meta.env.VITE_APP_API_BASE;
const API_BASE = 'http://localhost:5000/api/mock';
class ApiError extends Error {
  constructor(message, statusCode, responseData) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.responseData = responseData;
  }
}

export class ApiService {
  constructor() {
    this.baseUrl = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: response.statusText };
        }
        
        throw new ApiError(
          errorData.error || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error.message || 'Network error',
        0,
        { error: 'Network connectivity issue' }
      );
    }
  }

  async getTransactions(page = 1) {
    return this.request(`/transactions?pageSize=${page}`);
  }

  async searchTransactions(searchParams) {
    return this.request('/transactions/search', {
      method: 'POST',
      body: searchParams,
    });
  }

  async healthCheck() {
    return this.request('/transactions/health');
  }
}

export const apiService = new ApiService();