import { useState } from 'react';
import { ArrowUp, ArrowDown, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { formatCurrency, formatDate, getTransactionType } from '../utils/formatters';
import { LoadingSpinner } from './LoadingSpinner';

export function TransactionTable({ transactions, loading, error, onRefresh }) {
  const [visibleColumns, setVisibleColumns] = useState({
    sender: true,
    receiver: true,
    amount: true,
    currency: true,
    cause: true,
    createdAt: true,
  });

  const toggleColumn = (col) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button onClick={onRefresh} className="btn-primary flex items-center mx-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No transactions found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white relative">
      {/* Sticky Column Toggle */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2 text-gray-600">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium">Show/Hide Columns</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.keys(visibleColumns).map((col) => (
            <label key={col} className="flex items-center gap-1 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={visibleColumns[col]}
                onChange={() => toggleColumn(col)}
                className="rounded border-gray-300"
              />
              {col.charAt(0).toUpperCase() + col.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Table */}
      <table className="w-full min-w-[600px]">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            {visibleColumns.sender && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>}
            {visibleColumns.receiver && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>}
            {visibleColumns.amount && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>}
            {visibleColumns.currency && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>}
            {visibleColumns.cause && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cause</th>}
            {visibleColumns.createdAt && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => {
            const type = getTransactionType(transaction);
            return (
              <tr key={transaction.id} className={`hover:bg-gray-50 transition-colors ${type === 'incoming' ? 'bg-green-50' : 'bg-red-50'}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                {visibleColumns.sender && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.sender}</td>}
                {visibleColumns.receiver && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.receiver}</td>}
                {visibleColumns.amount && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className={`flex items-center ${type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                      {type === 'incoming' ? <ArrowDown className="h-4 w-4 mr-1" /> : <ArrowUp className="h-4 w-4 mr-1" />}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                  </td>
                )}
                {visibleColumns.currency && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.currency}</td>}
                {visibleColumns.cause && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.cause}</td>}
                {visibleColumns.createdAt && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(transaction.createdAt)}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
