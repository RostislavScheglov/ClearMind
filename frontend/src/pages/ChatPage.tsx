import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionDetail, useSendMessage } from '../api/sessions';
import { MessageList } from '../components/chat/MessageList';
import { ChatInput } from '../components/chat/ChatInput';
import { PaywallModal } from '../components/billing/PaywallModal';
import { Spinner } from '../components/ui/Spinner';
import { useAuthStore } from '../store/authStore';

export function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading } = useSessionDetail(sessionId!);
  const sendMessage = useSendMessage(sessionId!);
  const [showPaywall, setShowPaywall] = useState(false);
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>Session not found.</p>
      </div>
    );
  }

  const handleSend = (content: string) => {
    sendMessage.mutate(
      content,
      {
        onError: (error: any) => {
          if (error?.response?.status === 402) {
            setShowPaywall(true);
          }
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full -m-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <h2 className="font-semibold truncate">
          {session.title || 'New Session'}
        </h2>
      </div>

      <MessageList
        messages={session.messages || []}
        isLoading={sendMessage.isPending}
        intent={user?.intent}
        onSuggestionClick={handleSend}
      />
      <ChatInput onSend={handleSend} disabled={sendMessage.isPending} />
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
