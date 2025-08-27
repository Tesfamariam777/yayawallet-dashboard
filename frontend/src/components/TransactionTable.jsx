// src/components/TransactionTable.jsx
import { Download, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDate, getTransactionType } from '../utils/formatters';
import { LoadingSpinner } from './LoadingSpinner';

export function TransactionTable({ transactions, loading, error, onRefresh }) {
  if (loading) {
    return <LoadingSpinner size="large" />;
  }

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
      <div className="text-center py-12">
        <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Mobile View */}
      <div className="lg:hidden">
        {transactions.map((transaction) => {
          const type = getTransactionType(transaction);
          return (
            <div key={transaction.id} className="border-b border-gray-200 p-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">{transaction.id}</div>
                  <div className="text-sm text-gray-500">
                    {type === 'incoming' ? 'From: ' : 'To: '}
                    {type === 'incoming' ? transaction.sender : transaction.receiver}
                  </div>
                </div>
                <div className={`flex items-center ${type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                  {type === 'incoming' ? <ArrowDown className="h-4 w-4 mr-1" /> : <ArrowUp className="h-4 w-4 mr-1" />}
                  <span className="font-medium">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Cause: {transaction.cause}</div>
                <div>Date: {formatDate(transaction.createdAt)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="table-scroll overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receiver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cause
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => {
                const type = getTransactionType(transaction);
                return (
                  <tr
                    key={transaction.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      type === 'incoming' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.sender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.receiver}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className={`flex items-center ${type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                        {type === 'incoming' ? <ArrowDown className="h-4 w-4 mr-1" /> : <ArrowUp className="h-4 w-4 mr-1" />}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.cause}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(transaction.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}