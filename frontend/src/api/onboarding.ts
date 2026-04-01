import { useMutation } from '@tanstack/react-query';
import apiClient from './client';
import type { OnboardingInput } from '@shared/schemas/onboarding.schema';

export function useSaveOnboarding() {
  return useMutation({
    mutationFn: async (data: OnboardingInput) => {
      const { data: response } = await apiClient.post('/api/onboarding', data);
      return response;
    },
  });
}
