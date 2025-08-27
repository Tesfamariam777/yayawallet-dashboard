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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container-responsive py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-red-900">
                  YaYa Wallet Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Monitor your transactions
                </p>
              </div>

              <div className="flex items-center sm:justify-end gap-2 sm:gap-4">
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="btn-secondary flex items-center text-sm px-3 py-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container-responsive py-6 flex-1">
          {/* Search Section */}
          <div className="mb-6">
            <SearchBar
              onSearch={search}
              loading={loading}
              currentQuery={searchQuery}
            />

            {searchResults && (
              <div className="mt-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 break-words">
                  Found {searchResults.transactions.length} results for "
                  {searchQuery}"
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
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Transactions {searchQuery && `(Search: "${searchQuery}")`}
              </h2>
              <span className="text-xs sm:text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="overflow-x-auto">
              <TransactionTable
                transactions={transactions}
                loading={loading}
                error={error}
                onRefresh={refetch}
              />
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              loading={loading}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="container-responsive py-6">
            <div className="text-center text-xs sm:text-sm text-gray-600">
              <p className="mt-1">&copy; 2024 YaYa Wallet. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
