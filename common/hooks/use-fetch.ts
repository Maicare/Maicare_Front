import { UseFetchResponse } from '@/common/types/api.types';
import { fetcher } from '@/common/api/fetcher';
import useSWR, { SWRConfiguration } from 'swr';

export function useFetch<T>(
  url: string,
  options?: SWRConfiguration
): UseFetchResponse<T> {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, options);

  return {
    data,
    error,
    isLoading: isLoading || (!error && !data),
    mutate
  };
}
