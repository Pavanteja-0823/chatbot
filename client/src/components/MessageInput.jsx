import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

export default function MessageInput() {
  const [input, setInput] = useState('');
  const { sendMessage, sending } = useChat();
  const textareaRef = useRef(null);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px';
    }
  };

  useEffect(() => {
    autoResize();
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    setInput('');
    sendMessage(trimmed);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-4 pb-4 pt-2 shrink-0">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3 items-end">
        <div className="flex-1 relative">
          <div className="glass rounded-2xl shadow-glass flex items-end px-4 py-2.5 focus-within:shadow-premium-sm focus-within:border-blue-300 transition-all border border-slate-200/60">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={sending}
              rows={1}
              className="flex-1 bg-transparent text-text-primary placeholder-slate-400 outline-none resize-none text-sm leading-relaxed max-h-[180px]"
              style={{ minHeight: '24px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="ml-2 p-2.5 rounded-xl bg-gradient-blue hover:shadow-premium text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none hover:scale-105 active:scale-95 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
