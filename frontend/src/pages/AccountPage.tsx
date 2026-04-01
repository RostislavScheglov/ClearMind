import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useSubscribe } from '../api/subscription';

export function AccountPage() {
  const { user, subscription, logout } = useAuthStore();
  const navigate = useNavigate();
  const subscribe = useSubscribe();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account</h1>

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
          {(!subscription || subscription.tier === 'free') && (
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
