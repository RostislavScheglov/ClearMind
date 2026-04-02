import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePanicSession, useSessionDetail, useSendMessage } from '../api/sessions';
import { MessageList } from '../components/chat/MessageList';
import { ChatInput } from '../components/chat/ChatInput';
import { MiniBreathingExercise } from '../components/breathing/MiniBreathingExercise';
import { Spinner } from '../components/ui/Spinner';
import type { Message } from '@shared/types';

export function PanicPage() {
  const navigate = useNavigate();
  const createPanic = useCreatePanicSession();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);
  const [started, setStarted] = useState(false);

  const { data: session } = useSessionDetail(sessionId ?? undefined);
  const sendMessage = useSendMessage(sessionId || '');

  // Start the panic session on mount
  const handleStart = () => {
    if (started) return;
    setStarted(true);
    createPanic.mutate(undefined, {
      onSuccess: (data) => {
        setSessionId(data.session.id);
        setInitialMessages(data.messages);
      },
    });
  };

  // Auto-start on mount
  if (!started) {
    handleStart();
  }

  const displayMessages = useMemo(() => {
    const serverMessages = session?.messages || initialMessages;
    if (
      pendingMessage &&
      !serverMessages.some((m) => m.content === pendingMessage.content && m.role === 'user')
    ) {
      return [...serverMessages, pendingMessage];
    }
    return serverMessages;
  }, [session?.messages, initialMessages, pendingMessage]);

  const handleSend = (content: string) => {
    if (!sessionId) return;
    const optimistic: Message = {
      id: `pending-${Date.now()}`,
      sessionId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setPendingMessage(optimistic);

    sendMessage.mutate(content, {
      onSettled: () => setPendingMessage(null),
    });
  };

  const isLoading = createPanic.isPending || (!sessionId && started);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-red-50">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to safety
        </button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xl">🚨</span>
          <h2 className="font-semibold text-red-700">Panic Support</h2>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner />
            <p className="text-gray-500 mt-3 text-sm">Getting help ready for you...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 flex flex-col min-h-0">
            <MessageList
              messages={displayMessages}
              isLoading={sendMessage.isPending}
            />
            <ChatInput
              onSend={handleSend}
              disabled={sendMessage.isPending || !sessionId}
            />
          </div>

          {/* Side panel - Breathing exercise */}
          <div className="md:w-64 lg:w-72 border-t md:border-t-0 md:border-l border-gray-200 bg-slate-950 flex items-center justify-center p-4">
            <MiniBreathingExercise />
          </div>
        </div>
      )}
    </div>
  );
}
