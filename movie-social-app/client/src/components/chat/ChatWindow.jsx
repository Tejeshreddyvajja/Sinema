import React, { useState, useEffect, useRef, useCallback } from 'react';

const ChatWindow = ({ chat }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [attachment, setAttachment] = useState(null); // State to store file attachments
  const [customBackground, setCustomBackground] = useState(''); // State to store custom background
  const [showMenu, setShowMenu] = useState(false); // State to show/hide the three-dot menu
  const [showEditBackground, setShowEditBackground] = useState(false); // State to show/hide the edit background modal
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false); // State to show/hide attachment preview
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageIndex: null });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: false }); // Add new state for popup position

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom whenever messages change
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && !attachment) return;

    // Add the new message or attachment to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'You',
        text: message,
        attachment,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setMessage('');
    setAttachment(null);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = file.type.split('/')[0]; // Determine the type (image, video, etc.)
      setAttachment({ file, type: fileType });
      setShowAttachmentPreview(true); // Show the attachment preview box
    }
  };

  const renderAttachment = (attachment) => {
    if (!attachment) return null;

    switch (attachment.type) {
      case 'image':
        return (
          <img
            src={URL.createObjectURL(attachment.file)}
            alt="Shared content"
            className="max-w-full max-h-40 rounded-lg mt-2"
          />
        );
      case 'video':
        return (
          <video
            controls
            className="max-w-full max-h-40 rounded-lg mt-2"
          >
            <source src={URL.createObjectURL(attachment.file)} type={attachment.file.type} />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return (
          <a
            href={URL.createObjectURL(attachment.file)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline text-sm mt-2 block"
          >
            {attachment.file.name}
          </a>
        );
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Dynamically adjust the height of the textarea
    const textarea = e.target;
    textarea.style.height = '0px'; // Reset height to calculate new height properly
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scrollHeight
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleFormSubmit(e); // Submit the form
    }
  };

  const resetTextareaHeight = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = '40px';
      textarea.style.overflow = 'hidden';
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && !attachment) return;

    // Add the new message or attachment to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'You',
        text: message,
        attachment,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setMessage('');
    setAttachment(null);
    resetTextareaHeight();
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        const fileType = file.type.split('/')[0];
        setAttachment({ file, type: fileType });
        setShowAttachmentPreview(true); // Show the attachment preview box
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const fileType = file.type.split('/')[0];
      setAttachment({ file, type: fileType });
      setShowAttachmentPreview(true); // Show the attachment preview box
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAttachmentCancel = () => {
    setAttachment(null);
    setShowAttachmentPreview(false);
  };

  const handleAttachmentSend = () => {
    if (!attachment) return;

    // Add the attachment as a message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'You',
        text: message,
        attachment,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setMessage('');
    setAttachment(null);
    setShowAttachmentPreview(false);
  };

  const renderAttachmentPreview = () => {
    if (!attachment) return null;

    switch (attachment.type) {
      case 'image':
        return (
          <img
            src={URL.createObjectURL(attachment.file)}
            alt="Preview"
            className="max-w-full max-h-40 rounded-lg"
          />
        );
      case 'video':
        return (
          <video
            controls
            className="max-w-full max-h-40 rounded-lg"
          >
            <source src={URL.createObjectURL(attachment.file)} type={attachment.file.type} />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return (
          <div className="text-gray-200 text-sm">
            {attachment.file.name}
          </div>
        );
    }
  };

  const handleReaction = (messageIndex, reaction) => {
    setMessages(messages.map((msg, index) => {
      if (index === messageIndex) {
        return {
          ...msg,
          reaction: reaction
        };
      }
      return msg;
    }));
    setContextMenu({ visible: false, x: 0, y: 0, messageIndex: null });
  };

  const handleCopyMessage = (messageIndex) => {
    navigator.clipboard.writeText(messages[messageIndex].text);
    setContextMenu({ visible: false, x: 0, y: 0, messageIndex: null });
  };

  const handleDeleteMessage = (messageIndex) => {
    setMessages(messages.filter((_, index) => index !== messageIndex));
    setContextMenu({ visible: false, x: 0, y: 0, messageIndex: null });
  };

  const handleContextMenuClose = useCallback(() => {
    setContextMenu({ visible: false, x: 0, y: 0, messageIndex: null });
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleContextMenuClose);
    return () => {
      document.removeEventListener('click', handleContextMenuClose);
    };
  }, [handleContextMenuClose]);

  // Add new function to handle context menu positioning
  const handleContextMenu = (e, index) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Context menu dimensions (approximated)
    const menuWidth = 192; // w-48 = 12rem = 192px
    const menuHeight = 200; // approximate height
    
    // Adjust position if menu would go off screen
    const adjustedX = Math.min(x, viewportWidth - menuWidth);
    const adjustedY = Math.min(y, viewportHeight - menuHeight);
    
    setContextMenu({
      visible: true,
      x: adjustedX,
      y: adjustedY,
      messageIndex: index
    });
  };

  const handleMessageClick = (e, index) => {
    e.stopPropagation();
    if (selectedMessage === index) {
      setSelectedMessage(null);
      return;
    }

    const messageElement = e.currentTarget;
    const messageRect = messageElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const popupHeight = 150; // Approximate height of popup

    // Check if there's more space above or below the message
    const spaceAbove = messageRect.top;
    const spaceBelow = windowHeight - messageRect.bottom;
    const showOnTop = spaceBelow < popupHeight && spaceAbove > spaceBelow;

    setPopupPosition({ top: showOnTop });
    setSelectedMessage(index);
  };

  if (!chat) {
    return (
      <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-4 shadow-2xl h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-200 mb-2">Select a chat</h3>
          <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: customBackground || 'url(/public/images/chat-pattern.png)', backgroundSize: 'cover', backgroundRepeat: 'repeat' }}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-2 bg-blue-995/30 border-b border-gray-700 relative backdrop-blur-md rounded-b-3xl rounded-t-2xl mt-1 shadow-inner shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium ring-1 ring-gray-600">
            {chat.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-medium text-xs leading-tight">{chat.name}</h3>
            <p className="text-gray-500 text-xs">
              {chat.isGroup ? `${chat.members} members` : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 relative">
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <div className="relative">
            <button
              className="p-2 text-gray-400 hover:text-blue-500 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowMenu(!showMenu)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 5.25a.75.75 0 110-1.5.75.75 0 010 1.5zm0 5.25a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-gray-200 rounded-lg shadow-lg z-50">
                <ul className="py-1">
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer focus:bg-gray-700 focus:outline-none"
                    onClick={() => setShowEditBackground(true)}
                  >
                    Edit Wallpaper
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer focus:bg-gray-700 focus:outline-none">Video Call</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer focus:bg-gray-700 focus:outline-none">Mute...</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer focus:bg-gray-700 focus:outline-none">Select messages</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer focus:bg-gray-700 focus:outline-none">Send a Gift</li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer focus:bg-gray-700 focus:outline-none">Block user</li>
                  <li className="px-4 py-2 text-red-500 hover:bg-gray-700 cursor-pointer focus:bg-gray-700 focus:outline-none">Delete chat</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Wallpaper Modal */}
      {showEditBackground && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-white text-lg font-medium mb-4">Edit Wallpaper</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Upload Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (event) => setCustomBackground(`url(${event.target.result})`);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-gray-400 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Solid Color:</label>
                <input
                  type="color"
                  onChange={(e) => setCustomBackground(e.target.value)}
                  className="w-12 h-12 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowEditBackground(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowEditBackground(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {showAttachmentPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg">Send Attachment</h3>
              <button
                onClick={handleAttachmentCancel}
                className="text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
            <div className="mb-4">{renderAttachmentPreview()}</div>
            <textarea
              value={message}
              onChange={handleInputChange}
              placeholder="Add a caption..."
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
              rows="2"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleAttachmentCancel}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAttachmentSend}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} space-x-1 relative`}
          >
            {msg.sender !== 'You' && (
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                {msg.sender.charAt(0).toUpperCase()}
              </div>
            )}
            <div 
              onClick={(e) => handleMessageClick(e, index)}
              className={`message-bubble relative cursor-pointer ${
                msg.sender === 'You' 
                  ? 'message-bubble-right bubble-tail-right' 
                  : 'message-bubble-left bubble-tail-left'
              }`}
            >
              <p className="message-text break-words whitespace-pre-wrap mb-2 mr-2 ml-2 message-text-xs">{msg.text}</p>
              {msg.attachment && renderAttachment(msg.attachment)}
              {msg.reaction && (
                <div className="absolute -bottom-4 right-0 bg-gray-800 rounded-full px-2 py-1 text-sm">
                  {msg.reaction}
                </div>
              )}
              <span className="message-time">{msg.time}</span>

              {/* Message Options Popup */}
              {selectedMessage === index && (
                <div 
                  className={`absolute ${
                    popupPosition.top ? 'bottom-full mb-2' : 'top-full mt-2'
                  } right-0 bg-gray-800 rounded-lg shadow-lg py-2 w-48 z-50`}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex flex-wrap gap-2 p-2 border-b border-gray-700">
                    {['👍', '❤️', '😂', '😮', '😢', '😠'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(index, emoji);
                          setSelectedMessage(null);
                        }}
                        className="hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyMessage(index);
                      setSelectedMessage(null);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-200 text-sm hover:bg-gray-700"
                  >
                    Copy Message
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMessage(index);
                      setSelectedMessage(null);
                    }}
                    className="w-full px-4 py-2 text-left text-red-500 text-sm hover:bg-gray-700"
                  >
                    Delete Message
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 bg-gray-800 rounded-lg shadow-lg py-2 w-48"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            transform: 'scale(1)',
            transformOrigin: 'top left'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2 text-gray-400 text-xs border-b border-gray-700">
            Message Options
          </div>
          <div className="py-1">
            <div className="px-4 py-2 text-gray-200 text-sm hover:bg-gray-700 cursor-pointer">
              React
              <div className="flex space-x-2 mt-1">
                {['👍', '❤️', '😂', '😮', '😢', '😠'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(contextMenu.messageIndex, emoji)}
                    className="hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => handleCopyMessage(contextMenu.messageIndex)}
              className="w-full px-4 py-2 text-left text-gray-200 text-sm hover:bg-gray-700"
            >
              Copy Message
            </button>
            <button
              onClick={() => handleDeleteMessage(contextMenu.messageIndex)}
              className="w-full px-4 py-2 text-left text-red-500 text-sm hover:bg-gray-700"
            >
              Delete Message
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <form
        onSubmit={handleFormSubmit}
        onDrop={handleDrop} // Handle file drop
        onDragOver={handleDragOver} // Allow drag-over
        className="p-2 bg-blue-950/30 background-blur-xl shadow-xl rounded-b-2xl rounded-t-2xl mb-1 shadow-inner flex items-center space-x-3"
      >
        <button
          type="button"
          onClick={() => handleEmojiClick('😊')}
          className="p-2 text-gray-400 hover:text-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <textarea
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Handle Enter and Shift+Enter
          onPaste={handlePaste} // Handle paste
          placeholder="Message"
          className="flex-1 bg-gray-700 text-gray-200 placeholder-gray-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
          style={{ minHeight: '40px' }} // Ensure a minimum height
          rows="1"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="p-2 text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-110 hover:bg-blue-600/20 rounded-lg cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </label>
        <button
          type="submit"
          className="p-1 bg-green-600 text-white rounded-lg hover:bg-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;