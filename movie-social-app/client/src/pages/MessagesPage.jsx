import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import MainSidebar from '../components/MainSidebar';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import axios from 'axios';

const MessagesPage = () => {
  const { user } = useUser();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatListVisible, setIsChatListVisible] = useState(true);
  const [hamburgerPosition, setHamburgerPosition] = useState({ top: 80, left: 20 });
  const [searchQuery, setSearchQuery] = useState('');

  const dragStartRef = useRef(null);

  // Fetch user's conversations
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      
      try {
        // In a real implementation, you would fetch actual chat data from your backend
        // For now, initializing with an empty array as we'll build conversations from friend interactions
        setChats([]);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, [user?.id]);

  // Handle active chat from route state (e.g. when starting a chat from profile page)
  useEffect(() => {
    if (location.state?.activeChat) {
      // Check if this chat is already in our chats list
      const existingChatIndex = chats.findIndex(chat => chat.id === location.state.activeChat.id);
      
      if (existingChatIndex >= 0) {
        // If chat already exists, make it active
        setActiveChat(chats[existingChatIndex]);
      } else {
        // If it's a new chat, add it to the list and make it active
        const newChat = location.state.activeChat;
        setChats(prevChats => [newChat, ...prevChats]);
        setActiveChat(newChat);
      }
    }
  }, [location.state, chats]);

  const handleChatSelect = (chat) => {
    // Check if the chat is already in our list, if not, add it
    const existingChatIndex = chats.findIndex(c => c.id === chat.id);
    
    if (existingChatIndex < 0) {
      setChats(prevChats => [chat, ...prevChats]);
    }
    
    setActiveChat(chat);
    setIsChatListVisible(false); // Hide chat list on smaller screens
  };

  const handleSendMessage = (chatId, message) => {
    // Update the chat with the new message
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: message,
            timestamp: 'Just now'
          };
        }
        return chat;
      })
    );
    
    // In a real implementation, you would also send the message to your backend
    // and potentially use websockets for real-time updates
  };

  const handleDragStart = (e) => {
    dragStartRef.current = {
      x: e.clientX - hamburgerPosition.left,
      y: e.clientY - hamburgerPosition.top,
    };
  };

  const handleDrag = (e) => {
    if (dragStartRef.current) {
      const newLeft = e.clientX - dragStartRef.current.x;
      const newTop = e.clientY - dragStartRef.current.y;

      // Restrict movement within the viewport
      const clampedLeft = Math.max(0, Math.min(window.innerWidth - 50, newLeft));
      const clampedTop = Math.max(0, Math.min(window.innerHeight - 50, newTop));

      setHamburgerPosition({ top: clampedTop, left: clampedLeft });
    }
  };

  const handleDragEnd = () => {
    dragStartRef.current = null; // Reset drag state
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] text-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <div 
        id="mobile-sidebar"
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900/95 backdrop-blur-lg z-50 transform transition-transform duration-300 ease-in-out shadow-xl md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <button
            className="text-white text-sm font-medium"
            onClick={() => setIsSidebarOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="py-4 px-2">
          <MainSidebar inMobileSidebar={true} />
        </div>
      </div>

      {/* Draggable Hamburger Menu */}
      <button
        id="hamburger-button"
        className="md:hidden fixed z-50 bg-gray-800 text-white p-2 rounded-md shadow-lg"
        style={{ top: `${hamburgerPosition.top}px`, left: `${hamburgerPosition.left}px` }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onMouseDown={(e) => {
          dragStartRef.current = {
            x: e.clientX - hamburgerPosition.left,
            y: e.clientY - hamburgerPosition.top,
          };
        }}
        onMouseMove={(e) => {
          if (dragStartRef.current) {
            const newLeft = e.clientX - dragStartRef.current.x;
            const newTop = e.clientY - dragStartRef.current.y;

            // Restrict movement within the viewport
            const clampedLeft = Math.max(0, Math.min(window.innerWidth - 50, newLeft));
            const clampedTop = Math.max(0, Math.min(window.innerHeight - 50, newTop));

            setHamburgerPosition({ top: clampedTop, left: clampedLeft });
          }
        }}
        onMouseUp={() => {
          dragStartRef.current = null; // Reset drag state
        }}
        onMouseLeave={() => {
          dragStartRef.current = null; // Reset drag state if mouse leaves the button
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
          />
        </svg>
      </button>

      {/* Sidebar for larger screens */}
      <div
        className="hidden md:block fixed inset-y-0 left-0 z-40 md:relative md:translate-x-0 transition-transform duration-300"
      >
        <MainSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-20 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Chat List */}
          <div className={`${isChatListVisible ? 'block' : 'hidden'} md:block w-full md:w-1/3 lg:w-1/4 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 overflow-y-auto`}>
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Messages</h2>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <ChatList
              chats={filteredChats}
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
            />
          </div>

          {/* Chat Window */}
          <div className={`${!isChatListVisible || activeChat ? 'block' : 'hidden'} md:block flex-1 flex flex-col bg-gray-900/50 backdrop-blur-sm`}>
            {activeChat ? (
              <ChatWindow 
                chat={activeChat} 
                onBackClick={() => setIsChatListVisible(true)}
                onSendMessage={(message) => handleSendMessage(activeChat.id, message)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-200 mb-2">Select a chat</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
