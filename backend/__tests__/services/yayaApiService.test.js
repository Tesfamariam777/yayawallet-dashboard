import { YayaApiService } from '../../services/yayaApiService.js';

// Mock the external dependencies
jest.mock('https');
jest.mock('../../utils/authUtils.js');

import https from 'https';
import { getServerTime, generateAuthHeaders } from '../../utils/authUtils.js';

describe('YayaApiService', () => {
  let apiService;
  const mockApiKey = 'test-api-key';
  const mockJWT = 'mock-jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
    apiService = new YayaApiService(mockApiKey, mockJWT);
  });

  describe('getTransactions', () => {
    test('should make GET request to transactions endpoint', async () => {
      const mockResponse = { transactions: [{ id: 'txn1' }] };
      mockHttpsRequest(mockResponse);

      const result = await apiService.getTransactions(1);
      
      expect(result).toEqual(mockResponse);
      expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          path: '/api/en/transaction/find-by-user?p=1'
        }),
        expect.any(Function)
      );
    });
  });

  describe('searchTransactions', () => {
    test('should make POST request to search endpoint', async () => {
      const mockResponse = { transactions: [] };
      mockHttpsRequest(mockResponse);

      const result = await apiService.searchTransactions({ account_name: 'test-account' });
      
      expect(result).toEqual(mockResponse);
      expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          path: '/api/en/transaction/search'
        }),
        expect.any(Function)
      );
    });

    test('should throw error for empty search parameters', async () => {
      await expect(apiService.searchTransactions({})).rejects.toThrow(
        'Exactly one search parameter must be provided'
      );
    });
  });

  // Helper function to mock HTTPS requests
  function mockHttpsRequest(responseData, statusCode = 200) {
    const mockResponse = {
      statusCode,
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from(JSON.stringify(responseData)));
        } else if (event === 'end') {
          callback();
        }
      })
    };

    const mockRequest = {
      on: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      setTimeout: jest.fn()
    };

    https.request.mockImplementation((options, callback) => {
      callback(mockResponse);
      return mockRequest;
    });

    getServerTime.mockResolvedValue('1756238312000');
    generateAuthHeaders.mockReturnValue({
      'YAYA-API-KEY': 'test-key',
      'YAYA-API-TIMESTAMP': '1756238312000',
      'YAYA-API-SIGN': 'test-signature',
      'Content-Type': 'application/json'
    });
  }
});