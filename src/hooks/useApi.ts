// Enhanced API hooks for LegalPro v1.0.1 - With Loading & Error Handling
import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from '../services/apiService';

// Enhanced API hook with comprehensive loading and error handling
export const useApi = <T = any>(
  apiFunction?: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (customApiFunction?: () => Promise<T>) => {
    const functionToExecute = customApiFunction || apiFunction;
    if (!functionToExecute) return;

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await functionToExecute();
      setData(result);
      setRetryCount(0);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiFunction]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    execute();
  }, [execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setRetryCount(0);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Auto-execute on mount and dependency changes
  useEffect(() => {
    if (apiFunction) {
      execute();
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  return {
    data,
    loading,
    error,
    retryCount,
    execute,
    retry,
    reset
  };
};

// Hook for form submissions with loading and error handling
export const useFormSubmission = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (apiFunction: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await apiFunction();
      setSuccess(true);
      return result;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    submit,
    reset
  };
};

// Hook for paginated data with loading states
export const usePaginatedApi = <T = any>(
  apiFunction: (page: number, limit: number) => Promise<{ data: T[]; total: number; page: number; totalPages: number }>,
  initialPage = 1,
  limit = 10
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async (pageNumber: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(pageNumber, limit);
      setData(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
      setPage(result.page);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunction, limit]);

  const goToPage = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchData(pageNumber);
    }
  }, [fetchData, totalPages]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      goToPage(page + 1);
    }
  }, [page, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      goToPage(page - 1);
    }
  }, [page, goToPage]);

  const refresh = useCallback(() => {
    fetchData(page);
  }, [fetchData, page]);

  useEffect(() => {
    fetchData(initialPage);
  }, [fetchData, initialPage]);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    total,
    goToPage,
    nextPage,
    prevPage,
    refresh,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};