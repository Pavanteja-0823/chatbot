import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { ChatProvider } from '../context/ChatContext';
import Sidebar from '../components/Sidebar';
import ChatMessages from '../components/ChatMessages';
import MessageInput from '../components/MessageInput';
import ParticleBackground from '../components/ParticleBackground';

function ChatContent() {
  const { logout } = useAuth();
  const { activeConversation } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-bg relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Sidebar - desktop */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-6 left-6 z-30">
        <button
          onClick={toggleSidebar}
          className="w-14 h-14 rounded-2xl bg-gradient-blue shadow-premium hover:shadow-premium-lg text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 md:hidden fade-in">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeSidebar} />
          <div className="relative w-80 h-full slide-in-right">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Floating Glass Header */}
        <header className="glass mx-4 mt-4 rounded-2xl px-5 py-3 flex items-center justify-between shadow-glass shrink-0 shadow-inner-glow">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <button
                onClick={toggleSidebar}
                className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-blue-50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-blue flex items-center justify-center shadow-premium-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-text-primary">
                  {activeConversation
                    ? activeConversation.title?.length > 35
                      ? activeConversation.title.substring(0, 35) + '...'
                      : activeConversation.title
                    : 'AI Chat'}
                </h1>
                <p className="text-xs text-text-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                  Powered by Groq AI
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-text-muted hover:text-accent-rose transition-all flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 min-h-0">
          <ChatMessages />
        </div>

        {/* Input */}
        <MessageInput />
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
}
