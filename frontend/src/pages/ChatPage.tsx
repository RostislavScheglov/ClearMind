import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionDetail, useSendMessage, useCreateSession } from '../api/sessions';
import { MessageList } from '../components/chat/MessageList';
import { ChatInput } from '../components/chat/ChatInput';
import { PaywallModal } from '../components/billing/PaywallModal';
import { Spinner } from '../components/ui/Spinner';
import { useAuthStore } from '../store/authStore';
import type { Message } from '@shared/types';

export function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const createSession = useCreateSession();
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);
  const { user } = useAuthStore();

  // If no sessionId, auto-create a new session
  useEffect(() => {
    if (!sessionId && !createSession.isPending && !createSession.isSuccess) {
      createSession.mutate(undefined, {
        onSuccess: (data) => {
          navigate(`/chat/${data.id}`, { replace: true });
        },
        onError: (error) => {
          const err = error as { response?: { status?: number } };
          if (err?.response?.status === 402) {
            setShowPaywall(true);
          }
        },
      });
    }
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: session, isLoading } = useSessionDetail(sessionId);
  const sendMessage = useSendMessage(sessionId || '');

  // Merge server messages with the optimistic pending message
  const displayMessages = useMemo(() => {
    const serverMessages = session?.messages || [];
    if (
      pendingMessage &&
      !serverMessages.some((m) => m.content === pendingMessage.content && m.role === 'user')
    ) {
      return [...serverMessages, pendingMessage];
    }
    return serverMessages;
  }, [session?.messages, pendingMessage]);

  if (!sessionId || isLoading || createSession.isPending) {
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
    const optimistic: Message = {
      id: `pending-${Date.now()}`,
      sessionId: sessionId || '',
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setPendingMessage(optimistic);

    sendMessage.mutate(
      content,
      {
        onSettled: () => {
          setPendingMessage(null);
        },
        onError: (error) => {
          const err = error as { response?: { status?: number } };
          if (err?.response?.status === 402) {
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
        messages={displayMessages}
        isLoading={sendMessage.isPending}
        intent={user?.intent}
        onSuggestionClick={handleSend}
      />
      <ChatInput onSend={handleSend} disabled={sendMessage.isPending} />
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
