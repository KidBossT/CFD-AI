import { create } from 'zustand';
import { ChatState, Message } from './types';

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  currentChatId: 'default',
  chats: [{ id: 'default', name: 'New Chat', messages: [] }],
  activeTab: 'chat',

  addMessage: (content, type, attachments = []) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      type,
      timestamp: new Date(),
      attachments,
      feedback: null,
    };
    set((state) => ({
      chats: state.chats.map(chat => 
        chat.id === state.currentChatId 
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      ),
      messages: state.currentChatId === 'default' ? [...state.messages, newMessage] : state.messages,
    }));
  },

  setLoading: (loading) => set({ isLoading: loading }),

  createNewChat: () => {
    const newChatId = crypto.randomUUID();
    set((state) => ({
      chats: [...state.chats, { id: newChatId, name: `New Chat ${state.chats.length + 1}`, messages: [] }],
      currentChatId: newChatId,
      messages: [],
    }));
  },

  deleteChat: (chatId) => {
    set((state) => {
      const newChats = state.chats.filter(chat => chat.id !== chatId);
      const newCurrentChatId = chatId === state.currentChatId
        ? newChats[0]?.id || 'default'
        : state.currentChatId;
      
      return {
        chats: newChats.length ? newChats : [{ id: 'default', name: 'New Chat', messages: [] }],
        currentChatId: newCurrentChatId,
        messages: newChats.find(chat => chat.id === newCurrentChatId)?.messages || [],
      };
    });
  },

  reorderChats: (startIndex: number, endIndex: number) => {
    set((state) => {
      const newChats = Array.from(state.chats);
      const [removed] = newChats.splice(startIndex, 1);
      newChats.splice(endIndex, 0, removed);
      return { chats: newChats };
    });
  },

  switchChat: (chatId) => {
    set((state) => ({
      currentChatId: chatId,
      messages: state.chats.find(chat => chat.id === chatId)?.messages || [],
    }));
  },

  setMessageFeedback: (messageId, feedback) => {
    set((state) => ({
      chats: state.chats.map(chat => ({
        ...chat,
        messages: chat.messages.map(msg =>
          msg.id === messageId ? { ...msg, feedback } : msg
        ),
      })),
      messages: state.messages.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      ),
    }));
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
}));