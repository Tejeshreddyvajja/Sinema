import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const WatchPartyChat = ({ userName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: userName,
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      // TODO: Send message to other users via WebSocket
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Watch Party Chat</h3>
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map(message => (
          <div 
            key={message.id}
            className={`flex flex-col ${
              message.user === userName ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm text-gray-400">{message.user}</span>
              <span className="text-xs text-gray-500">{message.timestamp}</span>
            </div>
            <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
              message.user === userName 
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-100'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <form 
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-700"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

WatchPartyChat.propTypes = {
  userName: PropTypes.string.isRequired,
};

export default WatchPartyChat;
