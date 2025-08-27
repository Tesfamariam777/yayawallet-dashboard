import { MockDataService } from '../../services/mockDataService.js';

describe('MockDataService', () => {
  let mockService;

  beforeEach(() => {
    mockService = new MockDataService();
  });

  describe('getTransactions', () => {
    test('should return paginated transactions', () => {
      const result = mockService.getTransactions(1, 10);
      
      expect(result.transactions).toHaveLength(10);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
      expect(result.pagination.totalCount).toBe(50);
    });

    test('should return empty array for out-of-bounds page', () => {
      const result = mockService.getTransactions(100, 10);
      expect(result.transactions).toHaveLength(0);
    });
  });

  describe('searchTransactions', () => {
    test('should search by transaction ID', () => {
      const allTransactions = mockService.getAllTransactions();
      const testTransaction = allTransactions[0];
      
      const result = mockService.searchTransactions(testTransaction.id);
      
      expect(result.transactions.length).toBeGreaterThan(0);
      expect(result.transactions[0].id).toBe(testTransaction.id);
    });

    test('should return all transactions for empty query', () => {
      const result = mockService.searchTransactions('');
      expect(result.transactions).toHaveLength(50);
    });
  });

  describe('getTransactionById', () => {
    test('should return transaction by ID', () => {
      const allTransactions = mockService.getAllTransactions();
      const testTransaction = allTransactions[0];
      
      const result = mockService.getTransactionById(testTransaction.id);
      
      expect(result).toEqual(testTransaction);
    });

    test('should return null for non-existent ID', () => {
      const result = mockService.getTransactionById('non-existent-id');
      expect(result).toBeNull();
    });
  });
});