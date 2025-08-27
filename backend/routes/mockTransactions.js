import express from 'express';
import { MockDataService } from '../services/mockDataService.js';

const router = express.Router();
const mockService = new MockDataService();

// GET /api/mock/transactions - Get mock transactions with pagination
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const result = mockService.getTransactions(page, pageSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mock transactions' });
  }
});

// POST /api/mock/transactions/search - Search mock transactions
router.post('/search', (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = mockService.searchTransactions(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/mock/transactions/:id - Get specific transaction
router.get('/:id', (req, res) => {
  try {
    const transaction = mockService.getTransactionById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// GET /api/mock/transactions/debug/all - Get all transactions (for testing)
router.get('/debug/all', (req, res) => {
  try {
    const transactions = mockService.getAllTransactions();
    res.json({
      count: transactions.length,
      transactions: transactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all transactions' });
  }
});

// Health endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    type: 'mock',
    transactionCount: mockService.getAllTransactions().length,
    timestamp: new Date().toISOString()
  });
});

export default router;