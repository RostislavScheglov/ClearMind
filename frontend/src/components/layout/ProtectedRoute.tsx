import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useMe } from '../../api/auth';
import { Spinner } from '../ui/Spinner';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  skipOnboardingCheck?: boolean;
}

export function ProtectedRoute({ children, skipOnboardingCheck = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const { data, isLoading, isError } = useMe();

  useEffect(() => {
    if (data) {
      setUser(
        {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          onboardingComplete: data.user.onboardingComplete,
          intent: data.user.intent,
          notificationPref: data.user.notificationPref,
        },
        data.subscription
      );
    }
  }, [data, setUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <Spinner className="mt-20" />;
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  // Use local Zustand state if available (may be more up-to-date than stale query cache)
  const onboardingComplete = user?.onboardingComplete ?? data?.user.onboardingComplete;

  if (!skipOnboardingCheck && !onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
