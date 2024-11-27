import React from 'react';
import { Bot, User, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { Message } from '../types';
import { useChatStore } from '../store';

interface ChatMessageProps {
  message: Message;
}

const TypingAnimation = () => (
  <div className="flex space-x-2 p-2">
    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
  </div>
);

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';
  const setMessageFeedback = useChatStore(state => state.setMessageFeedback);
  const isLoading = useChatStore(state => state.isLoading);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 p-4 ${isBot ? 'bg-black/40' : ''} group`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isBot ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-gray-600 to-gray-800'
      }`}>
        {isBot ? <Bot className="w-5 h-5 text-black" /> : <User className="w-5 h-5 text-white" />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-sm text-green-400">
            {isBot ? 'Fluid 101' : 'You'}
          </span>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-green-500/10 rounded-md transition-colors"
              title={copied ? 'Copied!' : 'Copy message'}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {isBot && (
              <div className="flex gap-1">
                <button
                  onClick={() => setMessageFeedback(message.id, 'up')}
                  className={`p-1 hover:bg-green-500/10 rounded-md transition-colors ${
                    message.feedback === 'up' ? 'text-green-400' : 'text-gray-400'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMessageFeedback(message.id, 'down')}
                  className={`p-1 hover:bg-green-500/10 rounded-md transition-colors ${
                    message.feedback === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="prose prose-sm max-w-none text-gray-300">
          {message.content}
        </div>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex gap-2">
            {message.attachments.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Attachment ${index + 1}`}
                className="max-w-xs rounded-lg border border-green-500/20"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};