import React, { useState } from 'react';

const ChatWindow = ({ chat }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: Implement message sending
    setMessage('');
  };

  if (!chat) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">Select a chat</h3>
          <p className="text-gray-400">Choose a conversation from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 ring-1 ring-gray-700/50 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {chat.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-white font-medium leading-tight">{chat.name}</h3>
              <p className="text-gray-400 text-xs">
                {chat.isGroup ? `${chat.members} members` : 'Online'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1.5 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:bg-blue-500/10 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="p-1.5 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:bg-blue-500/10 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/30">
        {/* Sample messages - replace with actual messages */}
        <div className="flex items-start space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gray-700 ring-1 ring-gray-700/50 flex-shrink-0 flex items-center justify-center">
            <span className="text-white text-xs font-medium">{chat.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-white text-sm font-medium">{chat.name}</span>
              <span className="text-gray-400 text-xs">10:30 AM</span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-2 text-sm text-white">
              Hey! Would you like to watch the new Spider-Man movie together?
            </div>
          </div>
        </div>

        <div className="flex items-start justify-end space-x-2.5">
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-gray-400 text-xs">10:32 AM</span>
              <span className="text-white text-sm font-medium">You</span>
            </div>
            <div className="bg-blue-600/30 backdrop-blur-sm rounded-2xl rounded-tr-none px-4 py-2 text-sm text-white border border-blue-500/20">
              Sure! What time were you thinking?
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600/30 ring-1 ring-blue-500/30 flex-shrink-0 flex items-center justify-center">
            <span className="text-white text-xs font-medium">Y</span>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-800/30 backdrop-blur-sm border-t border-gray-700/50 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:bg-blue-500/10 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-gray-900/30 text-white placeholder-gray-400 rounded-lg pl-4 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/30 hover:border-gray-600/50 transition-all duration-300"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:bg-blue-500/10 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;