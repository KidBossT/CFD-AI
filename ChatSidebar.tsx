import React from 'react';
import { MessageSquarePlus, MessageSquare, Trash2, GripVertical } from 'lucide-react';
import { useChatStore } from '../store';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DroppableProps } from 'react-beautiful-dnd';

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

export const ChatSidebar: React.FC = () => {
  const { chats, currentChatId, createNewChat, deleteChat, switchChat, reorderChats } = useChatStore();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderChats(result.source.index, result.destination.index);
  };

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-64 bg-gradient-to-b from-gray-900 to-black border-r border-green-500/20 p-4 flex flex-col"
    >
      <button
        onClick={createNewChat}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-black px-4 py-2 rounded-lg hover:from-green-400 hover:to-green-500 transition-all duration-200 flex items-center justify-center gap-2 mb-4"
      >
        <MessageSquarePlus className="w-5 h-5" />
        New Chat
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId="chats">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex-1 space-y-2 overflow-y-auto scrollbar-thin"
            >
              {chats.map((chat, index) => (
                <Draggable key={chat.id} draggableId={chat.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`group rounded-lg transition-all duration-200 ${
                        currentChatId === chat.id
                          ? 'bg-green-500/20'
                          : 'hover:bg-green-500/10'
                      }`}
                    >
                      <div className="flex items-center p-2">
                        <div {...provided.dragHandleProps} className="px-2">
                          <GripVertical className="w-4 h-4 text-gray-500" />
                        </div>
                        <button
                          onClick={() => switchChat(chat.id)}
                          className="flex-1 flex items-center gap-2 px-2"
                        >
                          <MessageSquare className={`w-4 h-4 ${
                            currentChatId === chat.id ? 'text-green-400' : 'text-gray-400'
                          }`} />
                          <span className={`truncate ${
                            currentChatId === chat.id ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            {chat.name}
                          </span>
                        </button>
                        <button
                          onClick={() => deleteChat(chat.id)}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </motion.div>
  );
};