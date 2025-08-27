// import { useState, useEffect, useCallback } from 'react';
// import { apiService } from '../services/api';
// import { useDebounce } from './useDebounce';

// export function useTransactions() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState(null);

//   const debouncedSearchQuery = useDebounce(searchQuery, 500);

//   const loadTransactions = useCallback(async (page, query = '') => {
//     setLoading(true);
//     setError(null);

//     try {
//       let data;
      
//       if (query.trim()) {
//         data = await apiService.searchTransactions({ query: query.trim() });
//         setSearchResults(data);
//       } else {
//         data = await apiService.getTransactions(page);
//         setSearchResults(null);
//       }

//       setTransactions(data.transactions || []);
//       setCurrentPage(data.pagination?.currentPage || 1);
//       setTotalPages(data.pagination?.totalPages || 1);
//     } catch (err) {
//       setError(err.message);
//       setTransactions([]);
//       setSearchResults(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadTransactions(currentPage, debouncedSearchQuery);
//   }, [currentPage, debouncedSearchQuery, loadTransactions]);

//   const search = useCallback((query) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   }, []);

//   const setPage = useCallback((page) => {
//     setCurrentPage(page);
//   }, []);

//   const clearSearch = useCallback(() => {
//     setSearchQuery('');
//     setSearchResults(null);
//     setCurrentPage(1);
//   }, []);

//   return {
//     transactions,
//     loading,
//     error,
//     currentPage,
//     totalPages,
//     searchQuery,
//     searchResults,
//     search,
//     setPage,
//     clearSearch,
//     refetch: () => loadTransactions(currentPage, searchQuery),
//   };
// }

// src/hooks/useTransactions.js
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useDebounce } from './useDebounce';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const loadTransactions = useCallback(async (page, query = '') => {
    setLoading(true);
    setError(null);

    try {
      let data;
      
      if (query.trim()) {
        data = await apiService.searchTransactions({ query: query.trim() });
        setSearchMode(true);
        setTotalPages(1); // Search results typically don't have pagination
        setTotalCount(data.transactions?.length || 0);
      } else {
        data = await apiService.getTransactions(page);
        setSearchMode(false);
        setCurrentPage(data.pagination?.currentPage || page);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
      }

      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.message);
      setTransactions([]);
      setSearchMode(false);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      loadTransactions(1, debouncedSearchQuery);
    } else {
      loadTransactions(currentPage);
    }
  }, [currentPage, debouncedSearchQuery, loadTransactions]);

  const search = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentPage(1); // Reset to first page when searching
    }
  }, []);

  const setPage = useCallback((page) => {
    if (!searchMode) {
      setCurrentPage(page);
    }
  }, [searchMode]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchMode(false);
    setCurrentPage(1);
  }, []);

  const refetch = useCallback(() => {
    loadTransactions(currentPage, searchQuery);
  }, [currentPage, searchQuery, loadTransactions]);

  return {
    transactions,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    searchQuery,
    searchMode,
    search,
    setPage,
    clearSearch,
    refetch,
  };
}