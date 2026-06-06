import { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';

export default function ChatMessages() {
  const { messages, sending } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const formatContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    if (parts.length === 1) {
      return <p className="text-sm leading-relaxed whitespace-pre-wrap text-text-primary">{content}</p>;
    }
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.startsWith('```')) {
            const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
            return (
              <pre key={i}>
                <code>{code}</code>
              </pre>
            );
          }
          return part ? <span key={i} className="text-text-primary">{part}</span> : null;
        })}
      </div>
    );
  };

  if (messages.length === 0 && !sending) {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <div className="text-center max-w-lg fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-blue shadow-premium-sm flex items-center justify-center animate-glow">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-2">Start a conversation</h2>
          <p className="text-text-secondary">Type a message below to begin chatting with your AI assistant.</p>
          <div className="mt-8 flex items-center justify-center gap-2 text-text-muted">              <kbd className="px-2.5 py-1 text-xs rounded-lg bg-white border border-purple-200 shadow-glass-sm text-text-secondary">Enter</kbd>
            <span className="text-xs">to send</span>
            <span className="text-slate-300 mx-1">·</span>              <kbd className="px-2.5 py-1 text-xs rounded-lg bg-white border border-purple-200 shadow-glass-sm text-text-secondary">Shift + Enter</kbd>
            <span className="text-xs">new line</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-6 scroll-smooth">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg._id}
            className={index >= messages.length - 2 ? 'flex message-enter' : 'flex'}
          >
            <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold shadow-premium-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-blue text-white'
                      : 'bg-gradient-violet text-white'
                  }`}
                >
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>

                {/* Message Bubble */}
                <div className="group relative">
                  <div
                    className={`rounded-2xl px-5 py-3.5 ${
                      msg.role === 'user'
                        ? 'bg-gradient-message-user text-white rounded-tr-sm shadow-premium-sm'
                        : 'glass-strong rounded-tl-sm shadow-glass'
                    }`}
                  >
                    {formatContent(msg.content)}
                    {msg.createdAt && (
                      <p className={`text-xs mt-2 ${
                        msg.role === 'user' ? 'text-white/50' : 'text-text-muted'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Copy button */}
                  {msg.role === 'assistant' && !msg._id?.startsWith('error-') && (
                    <button
                      onClick={() => copyToClipboard(msg.content)}
                      className="absolute -top-2.5 -right-2.5 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-text-muted hover:text-accent-blue shadow-glass-sm"
                      title="Copy message"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}

                  {/* Error indicator */}
                  {msg._id?.startsWith('error-') && (
                    <div className="absolute -top-2.5 -right-2.5 p-1.5 rounded-full bg-rose-100 border border-rose-200">
                      <svg className="w-3 h-3 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {sending && (
          <div className="flex justify-start message-enter">
            <div className="flex gap-3 max-w-[80%] md:max-w-[70%]">
              <div className="w-9 h-9 rounded-xl bg-gradient-violet flex items-center justify-center text-sm font-bold text-white shadow-premium-sm shrink-0">
                AI
              </div>
              <div className="glass-strong rounded-2xl rounded-tl-sm px-5 py-4 shadow-glass">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-accent-indigo animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-accent-amber animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-text-secondary text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
