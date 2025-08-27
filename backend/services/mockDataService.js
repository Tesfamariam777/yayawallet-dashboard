import { v4 as uuidv4 } from 'uuid';

// Generate realistic mock data
function generateMockTransactions(count = 50) {
  const transactions = [];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
  const causes = ['Payment', 'Transfer', 'Refund', 'Top-up', 'Withdrawal', 'Fee', 'Purchase'];
  const accounts = [
    'acc-1234567890', 'acc-0987654321', 'acc-1122334455', 
    'acc-5566778899', 'acc-6677889900', 'acc-7788990011',
    'business-account', 'personal-account', 'savings-account'
  ];
  const names = [
    'John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson',
    'Robert Brown', 'Lisa Davis', 'Michael Miller', 'Emily Taylor',
    'James Anderson', 'Jennifer Thomas', 'Daniel Martinez', 'Jessica Lee'
  ];

  for (let i = 0; i < count; i++) {
    const isIncoming = Math.random() > 0.5;
    const isTopUp = Math.random() > 0.8;
    const amount = Math.random() * 1000 + 10;
    
    let sender, receiver;
    
    if (isTopUp) {
      sender = 'yaya-system';
      receiver = 'current-user';
    } else if (isIncoming) {
      sender = accounts[Math.floor(Math.random() * accounts.length)];
      receiver = 'current-user';
    } else {
      sender = 'current-user';
      receiver = accounts[Math.floor(Math.random() * accounts.length)];
    }

    const transaction = {
      id: `txn_${uuidv4().substring(0, 8)}`,
      sender: sender,
      receiver: receiver,
      amount: parseFloat(amount.toFixed(2)),
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      cause: causes[Math.floor(Math.random() * causes.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      type: isTopUp || isIncoming ? 'incoming' : 'outgoing',
      status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)]
    };

    // Add some metadata for top-up transactions
    if (isTopUp) {
      transaction.metadata = {
        topUpMethod: ['bank-transfer', 'credit-card', 'debit-card'][Math.floor(Math.random() * 3)],
        reference: `ref-${uuidv4().substring(0, 6)}`
      };
    }

    transactions.push(transaction);
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Generate mock data
const MOCK_TRANSACTIONS = generateMockTransactions(50);

export class MockDataService {
  /**
   * Get transactions with pagination
   * @param {number} page - Page number
   * @param {number} pageSize - Page size
   * @returns {Object} Paginated transactions
   */
  getTransactions(page = 1, pageSize = 10) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = MOCK_TRANSACTIONS.slice(startIndex, endIndex);
    
    return {
      transactions: paginatedTransactions,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(MOCK_TRANSACTIONS.length / pageSize),
        totalCount: MOCK_TRANSACTIONS.length,
        hasNext: endIndex < MOCK_TRANSACTIONS.length,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Search transactions by any field
   * @param {string} query - Search query
   * @returns {Object} Search results
   */
  searchTransactions(query) {
    if (!query || query.trim() === '') {
      return this.getTransactions(1, 10);
    }

    const searchTerm = query.toLowerCase().trim();
    
    const results = MOCK_TRANSACTIONS.filter(transaction =>
      transaction.id.toLowerCase().includes(searchTerm) ||
      transaction.sender.toLowerCase().includes(searchTerm) ||
      transaction.receiver.toLowerCase().includes(searchTerm) ||
      transaction.cause.toLowerCase().includes(searchTerm) ||
      transaction.amount.toString().includes(searchTerm) ||
      transaction.currency.toLowerCase().includes(searchTerm)
    );

    return {
      transactions: results,
      searchMetadata: {
        query: searchTerm,
        resultCount: results.length,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Search by specific field
   * @param {string} field - Field to search
   * @param {string} value - Value to search for
   * @returns {Object} Search results
   */
  searchByField(field, value) {
    if (!value || value.trim() === '') {
      return { transactions: [] };
    }

    const searchValue = value.toLowerCase().trim();
    const results = MOCK_TRANSACTIONS.filter(transaction =>
      transaction[field] && transaction[field].toString().toLowerCase().includes(searchValue)
    );

    return {
      transactions: results,
      searchMetadata: {
        field: field,
        value: searchValue,
        resultCount: results.length
      }
    };
  }

  /**
   * Get transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Object|null} Transaction or null
   */
  getTransactionById(id) {
    return MOCK_TRANSACTIONS.find(transaction => transaction.id === id) || null;
  }

  /**
   * Get all mock data (for debugging)
   * @returns {Array} All transactions
   */
  getAllTransactions() {
    return MOCK_TRANSACTIONS;
  }
}