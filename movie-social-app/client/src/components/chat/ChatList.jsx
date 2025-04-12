import React from 'react';

const ChatList = ({ chats, activeChat, onChatSelect }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-white">Messages</h2>
        <button className="p-1.5 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:bg-blue-500/10 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/30 hover:border-gray-600/50 transition-all duration-300"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="space-y-1 flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeChat?.id === chat.id
              ? 'bg-blue-600/20 border border-blue-500/30'
              : 'hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'}`}
            onClick={() => onChatSelect(chat)}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-700 ring-1 ring-gray-700/50 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {chat.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {chat.unread > 0 && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-gray-900">
                  {chat.unread}
                </div>
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="text-sm font-medium text-white truncate">{chat.name}</h3>
                <span className="text-xs text-gray-400 flex-shrink-0">{chat.timestamp}</span>
              </div>
              <div className="flex items-center text-xs">
                {chat.isGroup && (
                  <span className="text-blue-400 mr-1 font-medium">{chat.members} • </span>
                )}
                <p className="text-gray-400 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList; 