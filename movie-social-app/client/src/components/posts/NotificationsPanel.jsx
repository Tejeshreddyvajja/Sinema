import React from 'react';

const NotificationsPanel = ({ notifications = [] }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Notifications</h2>
        {notifications.length > 0 && (
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </div>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-3 hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
          >
            <p className="text-white text-sm">{notification.message}</p>
            <p className="text-gray-400 text-xs">{notification.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;