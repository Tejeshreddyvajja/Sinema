import React, { useState } from 'react';

const ChatList = ({ chats, activeChat, onChatSelect }) => {
  const [isChatListVisible, setIsChatListVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Made the ChatList component more compact by reducing padding and spacing
    <div className="h-full flex flex-col px-3 py-4 bg-gray-900/50 backdrop-blur-sm">
      {/* Chat List */}
      <div className="space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pr-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 group ${
              activeChat?.id === chat.id
                ? 'bg-blue-600/20 border border-blue-500/30'
                : 'hover:bg-gray-800/40 border border-transparent hover:border-gray-600/40'
            }`}
            onClick={() => onChatSelect(chat)}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium ring-1 ring-gray-600">
                {chat.name.charAt(0).toUpperCase()}
              </div>
              {chat.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center ring-2 ring-gray-900 font-semibold">
                  {chat.unread}
                </div>
              )}
            </div>

            {/* Chat Details */}
            <div className="ml-2 flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="text-sm font-semibold text-white truncate">{chat.name}</h3>
                <span className="text-xs text-gray-400 flex-shrink-0">{chat.timestamp}</span>
              </div>
              <div className="flex items-center text-xs text-gray-400 truncate">
                {chat.isGroup && (
                  <span className="text-blue-400 font-medium mr-1">{chat.members} •</span>
                )}
                <p className="truncate">{chat.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
