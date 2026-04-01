import { useEffect, useRef } from 'react';
import type { Message } from '@shared/types';
import type { Intent } from '@shared/constants';
import { SUGGESTED_QUESTIONS } from '@shared/constants';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  intent?: string | null;
  onSuggestionClick?: (question: string) => void;
}

export function MessageList({ messages, isLoading, intent, onSuggestionClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  if (messages.length === 0 && !isLoading) {
    const suggestions = intent && intent in SUGGESTED_QUESTIONS
      ? SUGGESTED_QUESTIONS[intent as Intent]
      : [];

    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-center p-8">
        <div className="max-w-lg w-full">
          <p className="text-4xl mb-4">💭</p>
          <p className="text-base">Start your reflection by typing a message below.</p>
          <p className="text-sm mt-2 mb-6">Tell me how you're feeling today.</p>

          {suggestions.length > 0 && (
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Or try one of these:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => onSuggestionClick?.(q)}
                    className="text-sm text-left px-3 py-2 rounded-xl bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 hover:border-primary-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start mb-3">
          <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
