import { useQuery } from '@tanstack/react-query';
import apiClient from './client';
import type { MeResponse } from '@shared/types';

export function useMe() {
  return useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/auth/me');
      return data;
    },
    retry: false,
    staleTime: 30_000,
  });
}
