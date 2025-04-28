import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const ChatList = ({ chats, activeChat, onChatSelect }) => {
  const { user } = useUser();
  const [isChatListVisible, setIsChatListVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'friends'

  // Fetch friends data
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.id) return;
      
      setLoadingFriends(true);
      
      try {
        const response = await axios.get(`/api/friend-requests/friends/${user.id}`);
        console.log('Friends data in ChatList:', response.data);
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends for chat list:', error);
        setFriends([]);
      } finally {
        setLoadingFriends(false);
      }
    };
    
    fetchFriends();
  }, [user?.id]);

  const handleStartChat = (friend) => {
    // We'll create a new chat object to simulate starting a conversation
    const newChat = {
      id: friend.clerkId, // Use the friend's ID as chat ID
      name: `${friend.firstName} ${friend.lastName}`,
      lastMessage: 'Start a conversation...',
      timestamp: 'Now',
      unread: 0,
      isGroup: false,
      members: 2 // User and friend
    };
    
    onChatSelect(newChat);
    setActiveTab('chats');
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm">
      {/* Tabs Navigation */}
      <div className="flex mb-2 border-b border-gray-800">
        <button 
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'chats' 
            ? 'text-blue-400 border-b-2 border-blue-400' 
            : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('chats')}
        >
          Chats
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'friends' 
            ? 'text-blue-400 border-b-2 border-blue-400' 
            : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends {friends.length > 0 && `(${friends.length})`}
        </button>
      </div>

      {/* Chat/Friends List Content */}
      <div className="px-3 py-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {activeTab === 'chats' ? (
          // Chats Tab Content
          <div className="space-y-1">
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
            
            {chats.length === 0 && (
              <div className="text-center py-6">
                <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-sm text-gray-400">No conversations yet</p>
                <p className="text-xs text-gray-500 mt-1">Start chatting with friends</p>
                <button
                  onClick={() => setActiveTab('friends')}
                  className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-xs rounded-md"
                >
                  Find Friends
                </button>
              </div>
            )}
          </div>
        ) : (
          // Friends Tab Content
          <div className="space-y-1">
            {loadingFriends ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse flex space-x-3 items-center">
                  <div className="rounded-full bg-gray-700 h-10 w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <div
                      key={friend.clerkId}
                      className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-800/40 border border-transparent hover:border-gray-600/40 transition-all duration-200 group"
                      onClick={() => handleStartChat(friend)}
                    >
                      {/* Friend Avatar */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden ring-1 ring-gray-600">
                          {friend.profilePicture ? (
                            <img 
                              src={friend.profilePicture} 
                              alt={`${friend.firstName} ${friend.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-medium">
                              {friend.firstName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        {/* Online indicator - Random for now, could be connected to real status later */}
                        {Math.random() > 0.5 && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        )}
                      </div>

                      {/* Friend Details */}
                      <div className="ml-2 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-white truncate">
                            {friend.firstName} {friend.lastName}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-400 truncate">Tap to start a conversation</p>
                      </div>
                      
                      {/* Message button */}
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartChat(friend);
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm text-gray-400">No friends yet</p>
                    <p className="text-xs text-gray-500 mt-1">Connect with others to start chatting</p>
                    <button
                      onClick={() => window.location.href = '/connections?tab=find'}
                      className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-xs rounded-md"
                    >
                      Find Friends
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
