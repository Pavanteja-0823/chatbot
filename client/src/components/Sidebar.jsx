import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export default function Sidebar() {
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    fetchConversations,
    fetchConversation,
    deleteConversation,
    newChat,
    loadingHistory,
  } = useChat();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const shortenTitle = (title) => {
    return title.length > 28 ? title.substring(0, 28) + '...' : title;
  };

  return (
    <aside className="w-80 glass rounded-2xl m-4 flex flex-col shadow-glass shrink-0 h-[calc(100vh-32px)]">
      {/* New Chat Button */}
      <div className="p-4 pb-2">
        <button
          onClick={newChat}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-blue text-white font-medium shadow-premium-sm hover:shadow-premium transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm">New chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-divider" />
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest">Conversations</h2>
          <div className="h-px flex-1 bg-gradient-divider" />
        </div>

        {loadingHistory && conversations.length === 0 ? (
          <div className="space-y-2 px-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-14 w-full" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-card flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-text-secondary text-sm font-medium">No conversations yet</p>
            <p className="text-text-muted text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                activeConversation?._id === conv._id
                  ? 'bg-gradient-card text-text-primary shadow-glass-sm border border-purple-200'
                  : 'text-text-secondary hover:bg-white/70 hover:text-text-primary border border-transparent'
              }`}
              onClick={() => fetchConversation(conv._id)}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                activeConversation?._id === conv._id
                  ? 'bg-accent-blue shadow-premium-sm'
                  : 'bg-text-dim group-hover:bg-text-muted'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate font-medium">{shortenTitle(conv.title)}</p>
                <p className="text-xs text-text-muted mt-0.5">{formatDate(conv.updatedAt)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-100 text-text-muted hover:text-rose-500 transition-all shrink-0"
                title="Delete conversation"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* User Info */}
      <div className="p-4 pt-2 border-t" style={{ borderColor: 'rgba(124, 58, 237, 0.12)' }}>
        <div className="flex items-center gap-3 px-1 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-blue flex items-center justify-center text-white text-sm font-semibold shadow-premium-sm shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-text-muted truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
