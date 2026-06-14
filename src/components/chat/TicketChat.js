"use client";

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, MessageSquare } from 'lucide-react';

export default function TicketChat({ ticketId }) {
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [wsError, setWsError] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  
  // Bulletproof way to get current user ID, even if cache is stale
  const getUserIdFromToken = (t) => {
    try {
      if (!t) return null;
      const base64Url = t.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.user_id;
    } catch (e) {
      return null;
    }
  };
  
  const currentUserId = user?.id || getUserIdFromToken(token);
  
  const scrollContainerRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/message/ticket/${ticketId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Normalize REST data to match our schema (handle pagination object if present)
        const dataList = Array.isArray(res.data) ? res.data : (res.data.results || []);
        const normalized = dataList.map(msg => ({
          id: msg.id,
          message: msg.message,
          sender_id: msg.sender,
          sender_name: msg.sender_info?.name || 'User',
          created_at: msg.created_at
        }));
        setMessages(normalized);
      } catch (err) {
        console.error("Failed to load chat history", err);
      } finally {
        setLoading(false);
      }
    };

    if (ticketId && token) {
      fetchHistory();
    }
  }, [ticketId, token]);

  // Connect WebSocket
  useEffect(() => {
    if (!ticketId || !token) return;

    // Convert API URL to WS URL dynamically
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const wsProtocol = apiUrl.startsWith('https') ? 'wss://' : 'ws://';
    const wsHost = apiUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}${wsHost}/ws/chat/${ticketId}/?token=${token}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setWsError(false);
      setIsSocketOpen(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Data from backend: id, message, sender_id, sender_name, created_at
      setMessages((prev) => {
        // Prevent duplicate appending if id already exists
        if (prev.some(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setWsError(true);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsSocketOpen(false);
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, [ticketId, token]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !isSocketOpen) return;

    socket.send(JSON.stringify({
      message: inputMessage.trim()
    }));
    setInputMessage('');
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="flex flex-col h-[600px] shadow-lg rounded-2xl overflow-hidden border-0 dark:border dark:border-neutral-800 bg-white dark:bg-black transition-colors duration-200">
      <CardHeader className="bg-[#1A1F36] dark:bg-neutral-900 text-white p-4 border-b dark:border-neutral-800 transition-colors duration-200">
        <CardTitle className="text-lg flex items-center gap-2 m-0">
          <MessageSquare className="w-5 h-5 text-[#0052FF]" /> Live Support Chat
        </CardTitle>
        {wsError && <p className="text-xs text-red-400 mt-1">Chat disconnected. Trying to reconnect...</p>}
      </CardHeader>
      
      <CardContent 
        ref={scrollContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-200 space-y-4"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-[#0052FF]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const senderId = msg.sender_id || msg.sender;
            const isMe = String(senderId) === String(currentUserId) || (msg.sender_name && user?.name && msg.sender_name.trim() === user.name.trim());
            return (
              <div key={msg.id || index} className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'} mb-1`}>
                {!isMe && <span className="text-[11px] font-medium text-gray-500 ml-2 mb-0.5">{msg.sender_name}</span>}
                <div 
                  className={`relative max-w-[85%] sm:max-w-[75%] px-3 py-1.5 rounded-xl shadow-sm ${
                    isMe 
                      ? 'bg-[#E7FFDB] dark:bg-[#005C4B] text-gray-900 dark:text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-[#202C33] text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-800 rounded-tl-sm'
                  }`}
                >
                  <div className="flex flex-wrap items-end gap-x-3 gap-y-1 justify-between">
                    <span className="text-[15px] leading-snug whitespace-pre-wrap break-words">
                      {msg.message}
                    </span>
                    <span className={`text-[10px] translate-y-0.5 ${isMe ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>

      <div className="p-4 bg-white dark:bg-black border-t dark:border-neutral-800 transition-colors duration-200">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="rounded-full bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 focus-visible:ring-[#0052FF]"
            disabled={!isSocketOpen}
          />
          <Button 
            type="submit" 
            disabled={!inputMessage.trim() || !isSocketOpen}
            className="rounded-full bg-[#0052FF] hover:bg-[#0040CC] w-10 h-10 p-0 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
