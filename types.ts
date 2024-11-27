export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  attachments?: string[];
  feedback?: 'up' | 'down' | null;
}

export interface ChatState {
  messages: Message[];
  addMessage: (content: string, type: 'user' | 'bot', attachments?: string[]) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  currentChatId: string;
  chats: { id: string; name: string; messages: Message[] }[];
  createNewChat: () => void;
  deleteChat: (chatId: string) => void;
  reorderChats: (startIndex: number, endIndex: number) => void;
  switchChat: (chatId: string) => void;
  setMessageFeedback: (messageId: string, feedback: 'up' | 'down') => void;
  activeTab: 'chat' | 'resources' | 'analyzer' | 'voice';
  setActiveTab: (tab: 'chat' | 'resources' | 'analyzer' | 'voice') => void;
}