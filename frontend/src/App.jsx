import { useState } from 'react';
import { TransactionTable } from './components/TransactionTable';
import { SearchBar } from './components/SearchBar';
import { Pagination } from './components/Pagination';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RefreshCw } from 'lucide-react';
import { useTransactions } from './hooks/useTransactions';

function App() {
  const {
    transactions,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    searchResults,
    search,
    setPage,
    // eslint-disable-next-line no-unused-vars
    clearSearch,
    refetch,
  } = useTransactions();

  const [showHelp, setShowHelp] = useState(false);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container-responsive py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-red-900">YaYa Wallet Dashboard</h1>
                <p className="text-sm text-gray-600">Monitor your transactions</p>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  {showHelp ? 'Hide Help' : 'Show Help'}
                </button>
                
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="btn-secondary flex items-center text-sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Help Section */}
        {showHelp && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="container-responsive py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">How to Use</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use the search bar to find transactions by any field</li>
                    <li>• Click column headers to sort (desktop)</li>
                    <li>• Use pagination to navigate through results</li>
                    <li>• Green rows indicate incoming transactions</li>
                    <li>• Red rows indicate outgoing transactions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Testing</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Backend: http://localhost:5000</li>
                    <li>• API endpoints: /api/transactions</li>
                    <li>• Mock API endpoints: /api/mock/transactions</li>
                    <li>• Health check: /api/transactions/health</li>
                    <li>• Mock data available if API is unavailable</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="container-responsive py-8">
          {/* Search Section */}
          <div className="mb-8">
            <SearchBar
              onSearch={search}
              loading={loading}
              currentQuery={searchQuery}
            />
            
            {searchResults && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Found {searchResults.transactions.length} results for "{searchQuery}"
                  {searchResults.searchMetadata?.message && (
                    <span className="block mt-1 text-blue-700">
                      {searchResults.searchMetadata.message}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Transactions Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Transactions {searchQuery && `(Search: "${searchQuery}")`}
              </h2>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <TransactionTable
              transactions={transactions}
              loading={loading}
              error={error}
              onRefresh={refetch}
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
          />

          {/* Stats Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
                <div className="text-sm text-gray-600">Current Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalPages}</div>
                <div className="text-sm text-gray-600">Total Pages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : 'Online'}
                </div>
                <div className="text-sm text-gray-600">API Status</div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="container-responsive py-6">
            <div className="text-center text-sm text-gray-600">
              <p className="mt-1">&copy; 2024 YaYa Wallet. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;