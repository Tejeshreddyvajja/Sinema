import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import MainSidebar from '../components/MainSidebar';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => {
  const { user } = useUser();
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatListVisible, setIsChatListVisible] = useState(true); // For toggling ChatList visibility

  const chats = [
    {
      id: 1,
      name: 'Movie Enthusiasts',
      lastMessage: 'Did you watch the new Marvel movie?',
      timestamp: '2h ago',
      unread: 3,
      members: 12,
      isGroup: true,
    },
    {
      id: 2,
      name: 'John Doe',
      lastMessage: 'I loved that movie!',
      timestamp: '1d ago',
      unread: 0,
      isGroup: false,
    },
    {
      id: 3,
      name: 'Film Critics',
      lastMessage: 'The cinematography was amazing',
      timestamp: '3d ago',
      unread: 5,
      members: 8,
      isGroup: true,
    },
  ];

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setIsChatListVisible(false); // Hide ChatList on smaller screens
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`md:block ${isSidebarOpen ? 'block' : 'hidden'} w-20`}>
        <MainSidebar />
      </div>
  
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Toggle */}
        <div className="md:hidden p-2 bg-gray-200">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
          </button>
        </div>
  
        <div className="flex flex-1 overflow-hidden">
          {/* Chat List */}
          {isChatListVisible || !activeChat ? (
            <div className="w-full md:w-1/3 overflow-y-auto border-r">
              <ChatList
                chats={chats}
                activeChat={activeChat}
                onChatSelect={handleChatSelect}
              />
            </div>
          ) : null}
  
          {/* Chat Window */}
          {!isChatListVisible && activeChat ? (
            <div className="flex-1 overflow-y-auto">
              <ChatWindow chat={activeChat} />
              <button
                onClick={() => setIsChatListVisible(true)} // Show ChatList on back
                className="md:hidden px-4 py-2 bg-indigo-600 text-white rounded m-4"
              >
                Back to Chats
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
