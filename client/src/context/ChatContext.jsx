import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const { data } = await api.get('/chat/history');
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const fetchConversation = useCallback(async (id) => {
    try {
      setLoadingHistory(true);
      const { data } = await api.get(`/chat/${id}`);
      setActiveConversation(data.conversation);
      setMessages(data.conversation.messages || []);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (content) => {
      setSending(true);

      // Optimistically add user message
      const userMessage = { role: 'user', content, _id: Date.now().toString() };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const { data } = await api.post('/chat/send', {
          conversationId: activeConversation?._id,
          message: content,
        });

        // If new conversation was created, update active conversation
        if (!activeConversation) {
          setActiveConversation({ _id: data.conversationId });
        }

        // Add AI response
        setMessages((prev) => [...prev, data.message]);

        // Refresh conversation list
        fetchConversations();
      } catch (error) {
        // Remove the optimistic user message on error
        setMessages((prev) => prev.filter((m) => m._id !== userMessage._id));
        const errorMsg = error.response?.data?.message || 'Failed to send message';
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `⚠️ ${errorMsg}`, _id: `error-${Date.now()}` },
        ]);
      } finally {
        setSending(false);
      }
    },
    [activeConversation, fetchConversations]
  );

  const deleteConversation = useCallback(
    async (id) => {
      try {
        await api.delete(`/chat/${id}`);
        if (activeConversation?._id === id) {
          setActiveConversation(null);
          setMessages([]);
        }
        fetchConversations();
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    },
    [activeConversation, fetchConversations]
  );

  const newChat = useCallback(() => {
    setActiveConversation(null);
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        sending,
        loadingHistory,
        fetchConversations,
        fetchConversation,
        sendMessage,
        deleteConversation,
        newChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
