import React from 'react';
import { Activity, MessageSquare, BookOpen, Image, Mic, Bot } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ChatSidebar } from './components/ChatSidebar';
import { Resources } from './components/Resources';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { VoiceAssistant } from './components/VoiceAssistant';
import { useChatStore } from './store';
import { getChatCompletion } from './services/openai';
import { motion, AnimatePresence } from 'framer-motion';

const TypingAnimation = () => (
  <div className="flex space-x-2 p-2">
    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
  </div>
);

function App() {
  const { messages, addMessage, isLoading, setLoading, activeTab, setActiveTab } = useChatStore();

  const handleSendMessage = async (content: string) => {
    addMessage(content, 'user');
    setLoading(true);
    try {
      const response = await getChatCompletion(content);
      addMessage(response, 'bot');
    } catch (error) {
      addMessage("I'm having trouble connecting. Please try again later.", 'bot');
    }
    setLoading(false);
  };

  const menuItems = [
    {
      id: 'chat',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Chat Assistant'
    },
    {
      id: 'resources',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Learning Resources'
    },
    {
      id: 'analyzer',
      icon: <Image className="w-5 h-5" />,
      description: 'Image Analysis'
    },
    {
      id: 'voice',
      icon: <Mic className="w-5 h-5" />,
      description: 'Voice Assistant'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'resources':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-8 h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin"
          >
            <Resources />
          </motion.div>
        );
      case 'analyzer':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-8 h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin"
          >
            <ImageAnalyzer />
          </motion.div>
        );
      case 'voice':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-8 h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin"
          >
            <VoiceAssistant />
          </motion.div>
        );
      default:
        return (
          <>
            <div className="h-[calc(100%-5rem)] overflow-y-auto scrollbar-thin">
              <AnimatePresence mode="wait">
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4">
                      <Activity className="w-12 h-12 text-black" />
                    </div>
                    <h2 className="text-xl font-semibold text-green-400 mb-2">
                      Welcome to Fluid 101
                    </h2>
                    <p className="text-gray-400 max-w-md">
                      Your advanced companion for computational fluid dynamics analysis and simulation.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <ChatMessage message={message} />
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 p-4 bg-black/40"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
                          <Bot className="w-5 h-5 text-black" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-sm text-green-400 block mb-1">
                            Fluid 101
                          </span>
                          <TypingAnimation />
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="p-4 border-t border-green-500/20 bg-black/40">
              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-gradient-to-r from-green-900/50 to-black border-b border-green-500/20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
                <Activity className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-green-400">Fluid 101</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full px-4 py-8">
          <div className="relative max-w-[1400px] mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-lg border border-green-500/20 overflow-hidden backdrop-blur-sm min-h-[calc(100vh-12rem)]">
              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>
            </div>

            <div className="fixed right-8 top-1/2 -translate-y-1/2 space-y-4">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-green-500 text-black shadow-lg shadow-green-500/20'
                      : 'bg-black/40 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={item.description}
                >
                  {item.icon}
                </motion.button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;