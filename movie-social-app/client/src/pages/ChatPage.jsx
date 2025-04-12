import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => {
  const { user } = useUser();
  const [activeChat, setActiveChat] = useState(null);

  // Mock data for chats
  const chats = [
    {
      id: 1,
      name: 'Movie Enthusiasts',
      lastMessage: 'Did you watch the new Marvel movie?',
      timestamp: '2h ago',
      unread: 3,
      members: 12,
      isGroup: true
    },
    {
      id: 2,
      name: 'John Doe',
      lastMessage: 'I loved that movie!',
      timestamp: '1d ago',
      unread: 0,
      isGroup: false
    },
    {
      id: 3,
      name: 'Film Critics',
      lastMessage: 'The cinematography was amazing',
      timestamp: '3d ago',
      unread: 5,
      members: 8,
      isGroup: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Chat List */}
          <div className="col-span-12 md:col-span-4">
            <ChatList
              chats={chats}
              activeChat={activeChat}
              onChatSelect={setActiveChat}
            />
          </div>

          {/* Chat Window */}
          <div className="col-span-12 md:col-span-8">
            <ChatWindow chat={activeChat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 