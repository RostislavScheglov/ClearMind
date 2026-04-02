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
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}

export function useCreatePanicSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/api/sessions/panic');
      return data as { session: Session; messages: Message[] };
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
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey: ['sessions', sessionId] });

      const previous = queryClient.getQueryData<Session & { messages: Message[] }>(['sessions', sessionId]);

      if (previous) {
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`,
          sessionId,
          role: 'user',
          content,
          createdAt: new Date().toISOString(),
        };
        queryClient.setQueryData<Session & { messages: Message[] }>(
          ['sessions', sessionId],
          {
            ...previous,
            messages: [...(previous.messages || []), optimisticMessage],
          },
        );
      }

      return { previous };
    },
    onError: (_err, _content, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['sessions', sessionId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
    },
  });
}
