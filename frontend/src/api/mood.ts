import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';
import type { MoodEntry, MoodTimeline } from '@shared/types';

export function useLogMood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { score: number; intent?: string; context?: string }) => {
      const { data: response } = await apiClient.post('/api/mood', data);
      return response as MoodEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood'] });
    },
  });
}

export function useMoodTimeline(days = 30) {
  return useQuery<MoodTimeline>({
    queryKey: ['mood', 'timeline', days],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/mood/timeline', {
        params: { days },
      });
      return data;
    },
    staleTime: 60_000,
  });
}
