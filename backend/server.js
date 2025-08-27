import express from 'express';
import dotenv from 'dotenv';
import transactionsRouter from './routes/transactions.js';
import mockTransactionsRouter from './routes/mockTransactions.js';
import { securityMiddleware, errorHandler } from './middleware/security.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(securityMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes - Real API
app.use('/api/transactions', transactionsRouter);

// Routes - Mock API
app.use('/api/mock/transactions', mockTransactionsRouter);

// Root endpoint with info
app.get('/', (req, res) => {
  res.json({
    message: 'YaYa Wallet Transactions API',
    version: '1.0.0',
    mode: process.env.USE_MOCK_DATA ? 'mock' : 'real',
    endpoints: {
      real: {
        transactions: '/api/transactions',
        search: '/api/transactions/search',
        health: '/api/transactions/health'
      },
      mock: {
        transactions: '/api/mock/transactions',
        search: '/api/mock/transactions/search',
        transactionById: '/api/mock/transactions/:id',
        health: '/api/mock/transactions/health',
        debug: '/api/mock/transactions/debug/all'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Real API: http://localhost:${PORT}/api/transactions`);
  console.log(`Mock API: http://localhost:${PORT}/api/mock/transactions`);
  console.log(`Mode: ${process.env.USE_MOCK_DATA ? 'MOCK' : 'REAL'} data`);
});

export default app;