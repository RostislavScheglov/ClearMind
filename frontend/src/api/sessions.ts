import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';
import type { Session, Message } from '@shared/types';

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/api/sessions');
      return data as Session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useSessions(limit = 20, offset = 0) {
  return useQuery<Session[]>({
    queryKey: ['sessions', limit, offset],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/sessions', {
        params: { limit, offset },
      });
      return data;
    },
    staleTime: 30_000,
  });
}

export function useSessionDetail(id: string | undefined) {
  return useQuery<Session & { messages: Message[] }>({
    queryKey: ['sessions', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/sessions/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const { data } = await apiClient.post(`/api/sessions/${sessionId}/messages`, {
        content,
      });
      return data as { userMessage: Message; assistantMessage: Message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
    },
  });
}
