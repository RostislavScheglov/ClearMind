import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { OnboardingStepper } from '../components/onboarding/OnboardingStepper';
import { useSaveOnboarding } from '../api/onboarding';
import { useSubscribe } from '../api/subscription';
import { useAuthStore } from '../store/authStore';

import type { OnboardingInput } from '@shared/schemas/onboarding.schema';

export function OnboardingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const saveOnboarding = useSaveOnboarding();
  const subscribe = useSubscribe();
  const { setUser, user } = useAuthStore();

  const completeOnboarding = () => {
    if (user) {
      setUser({ ...user, onboardingComplete: true }, null);
    }
    queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  const handleComplete = (data: OnboardingInput) => {
    saveOnboarding.mutate(data, {
      onSuccess: () => {
        completeOnboarding();
        navigate('/', { replace: true });
      },
    });
  };

  const handleChoosePro = (data: OnboardingInput) => {
    saveOnboarding.mutate(data, {
      onSuccess: () => {
        completeOnboarding();
        subscribe.mutate();
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 overflow-y-auto">
      <OnboardingStepper
        onComplete={handleComplete}
        onChoosePro={handleChoosePro}
        isSubmitting={saveOnboarding.isPending && !subscribe.isPending}
        isUpgrading={saveOnboarding.isPending && subscribe.isPending || subscribe.isPending}
      />
    </div>
  );
}
