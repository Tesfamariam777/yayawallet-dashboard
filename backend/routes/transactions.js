import express from 'express';
import { YayaApiService } from '../services/yayaApiService.js';

const router = express.Router();

// Initialize API service
const apiService = new YayaApiService(
  process.env.YAYA_API_KEY,
  process.env.YAYA_API_SECRET_JWT
);

// GET /api/transactions - Get transactions with pagination
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const transactions = await apiService.getTransactions(page);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// POST /api/transactions/search - Search transactions with single parameter
router.post('/search', async (req, res, next) => {
  try {
    const searchParams = req.body;

    // Validate that we have exactly one search parameter
    const paramKeys = Object.keys(searchParams).filter(key => 
      searchParams[key] !== undefined && 
      searchParams[key] !== null && 
      searchParams[key] !== ''
    );

    if (paramKeys.length === 0) {
      return res.status(400).json({
        error: 'Exactly one search parameter must be provided',
        valid_parameters: [ 
          'transaction_id', 
          'sender', 
          'receiver', 
          'cause'
        ]
      });
      //Or default to default search according to API docs
    }

    // Use only the first parameter (YaYa API limitation)
    const firstParam = paramKeys[0];
    const searchParam = { [firstParam]: searchParams[firstParam] };

    const results = await apiService.searchTransactions(searchParam);
    
    // Inform client if multiple parameters were provided
    if (paramKeys.length > 1) {
      results.search_metadata = {
        used_parameter: firstParam,
        ignored_parameters: paramKeys.slice(1),
        message: 'YaYa API only supports one search parameter at a time. The first provided parameter was used.'
      };
    }
    
    res.json(results);
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Test API connectivity
    await apiService.getTransactions(1);
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      error: 'API connectivity test failed',
      details: error.message 
    });
  }
});

export default router;