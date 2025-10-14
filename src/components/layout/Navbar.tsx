import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { Home as HomeIcon, Users, Moon, Sun, Bell, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { mockNotifications, type Notification } from '@/lib/mockData';

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev: Notification[]) =>
      prev.map((notif: Notification) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev: Notification[]) =>
      prev.map((notif: Notification) => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">DecisionHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <HomeIcon size={18} />
              <span>Home</span>
            </Link>
            <SignedIn>
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Users size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
            </SignedIn>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button>

            {/* Notifications */}
            <SignedIn>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-danger-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <NotificationDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
              </div>
            </SignedIn>

            {/* Auth */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
