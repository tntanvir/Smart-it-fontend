'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function NotificationBell() {
  const { token, isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const res = await axios.get(`${apiUrl}/api/auth/notifications/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setNotifications(prev => {
          const map = new Map();
          // Add prev notifications to map
          prev.forEach(n => map.set(String(n.id), n));
          // Overwrite/add fetched notifications
          res.data.forEach(n => map.set(String(n.id), n));
          
          return Array.from(map.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        });
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();

    // Set up WebSocket for real-time notifications
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const wsProtocol = apiUrl.startsWith('https') ? 'wss://' : 'ws://';
    const wsHost = apiUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}${wsHost}/ws/notifications/?token=${token}`;

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        setNotifications(prev => {
          const map = new Map();
          // Add existing notifications to map
          prev.forEach(n => map.set(String(n.id), n));
          // Add/Overwrite with the new websocket notification
          map.set(String(data.notification.id), data.notification);
          
          return Array.from(map.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        });
      }
    };

    ws.onerror = (error) => {
      // Ignore errors if the socket was intentionally closed by React Strict Mode cleanup
      if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
        return;
      }
      console.error('Notification WebSocket Error:', error);
    };

    return () => {
      ws.close();
    };
  }, [token, isAuthenticated]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleNotificationClick = async (notification) => {
    setIsOpen(false);
    
    // Mark as read if it's unread
    if (!notification.is_read) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        await axios.post(`${apiUrl}/api/auth/notifications/${notification.id}/read/`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        );
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-black animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-20 left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-96 bg-white dark:bg-[#111] border border-gray-200 dark:border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden transform sm:origin-top-right transition-all">
          <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 py-1 px-2 rounded-full font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-neutral-800/50">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors ${!notification.is_read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1">
                        {!notification.is_read ? (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.is_read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                          {notification.message}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-black/20 text-center">
            <span className="text-xs text-gray-400 font-medium">Real-time alerts active</span>
          </div>
        </div>
      )}
    </div>
  );
}
