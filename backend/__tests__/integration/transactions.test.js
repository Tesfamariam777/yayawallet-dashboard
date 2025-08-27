import request from 'supertest';
import app from '../../server.js';

// Mock the services
jest.mock('../../services/yayaApiService.js');
import { YayaApiService } from '../../services/yayaApiService.js';

describe('Transactions API', () => {
  let mockService;

  beforeAll(() => {
    mockService = new YayaApiService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/transactions', () => {
    test('should return transactions with pagination', async () => {
      const mockTransactions = {
        transactions: [{ id: 'txn1' }, { id: 'txn2' }],
        pagination: { currentPage: 1, totalPages: 5 }
      };

      mockService.getTransactions.mockResolvedValue(mockTransactions);

      const response = await request(app)
        .get('/api/transactions?page=1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockTransactions);
      expect(mockService.getTransactions).toHaveBeenCalledWith(1);
    });

    test('should handle service errors', async () => {
      mockService.getTransactions.mockRejectedValue(new Error('API unavailable'));

      const response = await request(app)
        .get('/api/transactions?page=1')
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('POST /api/transactions/search', () => {
    test('should search transactions with valid parameters', async () => {
      const mockResults = {
        transactions: [{ id: 'txn1', account_name: 'test-account' }]
      };

      mockService.searchTransactions.mockResolvedValue(mockResults);

      const response = await request(app)
        .post('/api/transactions/search')
        .send({ account_name: 'test-account' })
        .expect(200);

      expect(response.body).toEqual(mockResults);
    });

    test('should return 400 for missing search parameters', async () => {
      const response = await request(app)
        .post('/api/transactions/search')
        .send({})
        .expect(400);

      expect(response.body.error).toContain('Exactly one search parameter must be provided');
    });
  });

  describe('Health Check', () => {
    test('should return healthy status when API is working', async () => {
      mockService.getTransactions.mockResolvedValue({ transactions: [] });

      const response = await request(app)
        .get('/api/transactions/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
    });

    test('should return unhealthy status when API is down', async () => {
      mockService.getTransactions.mockRejectedValue(new Error('API down'));

      const response = await request(app)
        .get('/api/transactions/health')
        .expect(503);

      expect(response.body.status).toBe('unhealthy');
    });
  });
});