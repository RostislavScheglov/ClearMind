import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useSubscribe } from '../api/subscription';

export function AccountPage() {
  const { user, subscription, logout } = useAuthStore();
  const navigate = useNavigate();
  const subscribe = useSubscribe();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // After Stripe redirect, poll for subscription update
  useEffect(() => {
    if (searchParams.get('upgraded') !== 'true') return;

    // If subscription is already pro, clean up the query param
    if (subscription?.tier === 'pro') {
      setSearchParams({}, { replace: true });
      return;
    }

    // Poll every 2s until the webhook is processed (max 30s)
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      if (attempts >= 15) {
        clearInterval(interval);
        setSearchParams({}, { replace: true });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [searchParams, setSearchParams, subscription?.tier, queryClient]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isUpgrading = searchParams.get('upgraded') === 'true' && subscription?.tier !== 'pro';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account</h1>

      {isUpgrading && (
        <Card>
          <p className="text-sm text-primary-600 font-medium">
            Processing your upgrade... This may take a moment.
          </p>
        </Card>
      )}

      <Card>
        <h3 className="font-semibold mb-2">Profile</h3>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </Card>

      <Card>
        <h3 className="font-semibold mb-2">Subscription</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium capitalize">
              {subscription?.tier || 'free'} Plan
            </p>
            <p className="text-xs text-gray-400">
              {subscription?.tier === 'pro'
                ? `Renews ${subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}`
                : '3 free sessions included'}
            </p>
          </div>
          {(!subscription || subscription.tier === 'free') && !isUpgrading && (
            <Button onClick={() => subscribe.mutate()} isLoading={subscribe.isPending} size="sm">
              Upgrade
            </Button>
          )}
        </div>
      </Card>

      <Button variant="secondary" onClick={handleLogout} className="w-full">
        Sign Out
      </Button>
    </div>
  );
}
