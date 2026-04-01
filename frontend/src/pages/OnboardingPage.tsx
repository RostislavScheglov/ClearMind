import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { OnboardingStepper } from '../components/onboarding/OnboardingStepper';
import { useSaveOnboarding } from '../api/onboarding';
import { useAuthStore } from '../store/authStore';

import type { OnboardingInput } from '@shared/schemas/onboarding.schema';

export function OnboardingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const saveOnboarding = useSaveOnboarding();
  const { setUser, user } = useAuthStore();

  const handleComplete = (data: OnboardingInput) => {
    saveOnboarding.mutate(data, {
      onSuccess: () => {
        if (user) {
          setUser({ ...user, onboardingComplete: true }, null);
        }
        queryClient.invalidateQueries({ queryKey: ['me'] });
        navigate('/', { replace: true });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <OnboardingStepper onComplete={handleComplete} isSubmitting={saveOnboarding.isPending} />
    </div>
  );
}
