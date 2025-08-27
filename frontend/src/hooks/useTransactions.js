import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useDebounce } from './useDebounce';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const loadTransactions = useCallback(async (page, query = '') => {
    setLoading(true);
    setError(null);

    try {
      let data;
      
      if (query.trim()) {
        data = await apiService.searchTransactions({ query: query.trim() });
        setSearchResults(data);
      } else {
        data = await apiService.getTransactions(page);
        setSearchResults(null);
      }

      setTransactions(data.transactions || []);
      setCurrentPage(data.pagination?.currentPage || 1);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
      setTransactions([]);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery, loadTransactions]);

  const search = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const setPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults(null);
    setCurrentPage(1);
  }, []);

  return {
    transactions,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    searchResults,
    search,
    setPage,
    clearSearch,
    refetch: () => loadTransactions(currentPage, searchQuery),
  };
}

