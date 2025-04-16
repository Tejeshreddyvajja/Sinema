import React, { useState, useRef } from 'react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
  const [isChatListVisible, setIsChatListVisible] = useState(true); // Chat list visibility toggle
  const [hamburgerPosition, setHamburgerPosition] = useState({ top: 80, left: 20 }); // Initial position of the hamburger

  const dragStartRef = useRef(null); // To track drag start position

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setIsChatListVisible(false); // Hide chat list on smaller screens
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
          <div className="hidden md:block w-1/3 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 overflow-y-auto">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Chats</h2>
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <ChatList
              chats={mockChats}
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
            />
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-gray-900/50 backdrop-blur-sm">
            {activeChat ? (
              <ChatWindow chat={activeChat} />
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
