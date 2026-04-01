import { useMutation } from '@tanstack/react-query';
import apiClient from './client';

export function useSubscribe() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/api/subscribe');
      return data as { checkoutUrl: string };
    },
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
  });
}
