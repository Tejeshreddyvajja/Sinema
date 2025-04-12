import React, { useState } from 'react';
import MainSidebar from '../components/MainSidebar';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

// Mock data for development
const mockChats = [
  {
    id: 1,
    name: 'John Doe',
    lastMessage: 'Hey, want to watch the new Spider-Man?',
    timestamp: '10:30 AM',
    unread: 2,
  },
  {
    id: 2,
    name: 'Movie Club',
    lastMessage: 'Alice: The new trailer looks amazing!',
    timestamp: 'Yesterday',
    unread: 0,
    isGroup: true,
    members: 5,
  },
  {
    id: 3,
    name: 'Sarah Wilson',
    lastMessage: 'Thanks for the recommendation!',
    timestamp: 'Yesterday',
    unread: 0,
  },
];

const MessagesPage = () => {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] text-white">
      <MainSidebar />
      <div className="ml-16 h-screen flex overflow-hidden p-4">
        {/* Chat List */}
        <div className="w-80 border-r border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-l-xl overflow-hidden">
          <ChatList
            chats={mockChats}
            activeChat={activeChat}
            onChatSelect={setActiveChat}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          <ChatWindow chat={activeChat} />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;