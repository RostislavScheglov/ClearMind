import { useQuery } from '@tanstack/react-query';
import apiClient from './client';
import type { InsightsResponse } from '@shared/types';

export function useInsights() {
  return useQuery<InsightsResponse>({
    queryKey: ['insights'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/insights');
      return data;
    },
    retry: false,
    staleTime: 5 * 60_000,
  });
}
