import React from 'react';
import { formatTime } from '@/lib/utils';
import { Bell, Check, MessageSquare, UserPlus, Vote } from 'lucide-react';

interface Notification {
  id: string;
  type: 'vote' | 'message' | 'invite' | 'mention';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return <Vote size={18} className="text-primary-600" />;
      case 'message':
        return <MessageSquare size={18} className="text-blue-600" />;
      case 'invite':
        return <UserPlus size={18} className="text-green-600" />;
      case 'mention':
        return <Bell size={18} className="text-yellow-600" />;
      default:
        return <Bell size={18} className="text-gray-600" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 text-center">
                No notifications yet
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm text-center mt-1">
                We'll notify you when something happens
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => {
                    onMarkAsRead(notification.id);
                    if (notification.link) {
                      window.location.href = notification.link;
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notification.id);
                        }}
                        className="flex-shrink-0 text-primary-600 hover:text-primary-700"
                      >
                        <Check size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2">
              View all notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}
