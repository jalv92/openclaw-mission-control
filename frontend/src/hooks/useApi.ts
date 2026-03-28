'use client';
import { useState, useEffect } from 'react';
import { API } from '../lib/api';

export function useApi<T>(path: string, initialData: T | null = null, deps: any[] = []) {
  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      setIsLoading(true);
      try {
        const result = await API.get(path);
        if (mounted) setData(result);
      } catch (err: any) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);

  return { data, updateData: setData, error, isLoading };
}
