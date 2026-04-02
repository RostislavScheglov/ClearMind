import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useSubscribe } from '../../api/subscription';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const subscribe = useSubscribe();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="You've reached the free limit">
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          You've used your 3 free reflection sessions. Upgrade to Pro for
          unlimited sessions and AI-powered insights.
        </p>

        <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-primary-700">Pro Plan</span>
            <span className="text-primary-600 font-medium">€5/month</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Unlimited reflection sessions</li>
            <li>✓ Unlimited messages per session</li>
            <li>✓ AI-powered behavioral insights</li>
            <li>✓ Full mood history & trends</li>
            <li>✓ 🌬️ Breathing exercises</li>
            <li>✓ 🚨 Panic Button — instant crisis support</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button
            onClick={() => subscribe.mutate()}
            isLoading={subscribe.isPending}
            className="flex-1"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </Modal>
  );
}
