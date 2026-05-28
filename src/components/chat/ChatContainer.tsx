// Chat Container Component - LegalPro v1.0.1
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import chatService, { Conversation, Message, TypingUser, OnlineUser } from '../../services/chatService';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import UserSearch from './UserSearch';
import { toast } from 'react-toastify';

interface ChatContainerProps {
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ className = '' }) => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingUser[]>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(new Map());
  const [showUserSearch, setShowUserSearch] = useState(false);

  // Initialize chat service
  useEffect(() => {
    if (!token || !user) return;

    const initializeChat = async () => {
      try {
        await chatService.connect(token);
        setConnected(true);
        await loadConversations();
      } catch (error) {
        console.error('Failed to connect to chat:', error);
        toast.error('Failed to connect to chat service');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      chatService.disconnect();
    };
  }, [token, user]);

  // Setup event listeners
  useEffect(() => {
    if (!connected) return;

    const handleMessageReceived = (data: { message: Message; conversationId: string }) => {
      const { message, conversationId } = data;
      
      // Add message to current conversation if it's selected
      if (selectedConversation?._id === conversationId) {
        setMessages(prev => [...prev, message]);
        
        // Mark as delivered
        chatService.markMessageAsDelivered(message._id);
        
        // Mark as read if window is focused
        if (document.hasFocus()) {
          chatService.markMessageAsRead(message._id, conversationId);
        }
      }

      // Update conversation list
      updateConversationLastMessage(conversationId, message);
    };

    const handleMessageSent = (data: { tempId?: string; message: Message }) => {
      const { tempId, message } = data;
      
      if (selectedConversation?._id === message.conversationId) {
        setMessages(prev => {
          if (tempId) {
            // Replace temporary message with real one
            return prev.map(msg => 
              msg._id === tempId ? message : msg
            );
          } else {
            return [...prev, message];
          }
        });
      }
    };

    const handleTypingStart = (data: { conversationId: string; userId: string; user: any }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        const conversationTyping = newMap.get(data.conversationId) || [];
        
        if (!conversationTyping.find(u => u.userId === data.userId)) {
          newMap.set(data.conversationId, [...conversationTyping, {
            userId: data.userId,
            user: data.user
          }]);
        }
        
        return newMap;
      });
    };

    const handleTypingStop = (data: { conversationId: string; userId: string }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        const conversationTyping = newMap.get(data.conversationId) || [];
        const filtered = conversationTyping.filter(u => u.userId !== data.userId);
        
        if (filtered.length === 0) {
          newMap.delete(data.conversationId);
        } else {
          newMap.set(data.conversationId, filtered);
        }
        
        return newMap;
      });
    };

    const handleUserStatusChange = (data: { userId: string; status: string; lastSeen: Date }) => {
      setOnlineUsers(prev => {
        const newMap = new Map(prev);
        newMap.set(data.userId, {
          userId: data.userId,
          status: data.status as 'online' | 'offline',
          lastSeen: data.lastSeen
        });
        return newMap;
      });
    };

    const handleError = (error: any) => {
      console.error('Chat error:', error);
      toast.error(error.message || 'Chat error occurred');
    };

    const handleRateLimitExceeded = (data: { message: string; retryAfter: number }) => {
      toast.warning(`Rate limit exceeded: ${data.message}`);
    };

    // Register event listeners
    chatService.on('message_received', handleMessageReceived);
    chatService.on('message_sent', handleMessageSent);
    chatService.on('typing_start', handleTypingStart);
    chatService.on('typing_stop', handleTypingStop);
    chatService.on('user_status_change', handleUserStatusChange);
    chatService.on('error', handleError);
    chatService.on('rate_limit_exceeded', handleRateLimitExceeded);

    return () => {
      chatService.off('message_received', handleMessageReceived);
      chatService.off('message_sent', handleMessageSent);
      chatService.off('typing_start', handleTypingStart);
      chatService.off('typing_stop', handleTypingStop);
      chatService.off('user_status_change', handleUserStatusChange);
      chatService.off('error', handleError);
      chatService.off('rate_limit_exceeded', handleRateLimitExceeded);
    };
  }, [connected, selectedConversation]);

  const loadConversations = async () => {
    try {
      const response = await chatService.getConversations({ limit: 50 });
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Failed to load conversations');
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await chatService.getMessages(conversationId, { limit: 50 });
      setMessages(response.data.reverse()); // Reverse to show oldest first
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const updateConversationLastMessage = (conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv._id === conversationId) {
        return {
          ...conv,
          lastMessage: {
            content: message.content.text || 'File attachment',
            timestamp: message.timestamp,
            senderId: message.senderId._id,
            messageType: message.content.type
          },
          updatedAt: message.timestamp
        };
      }
      return conv;
    }));
  };

  const handleConversationSelect = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation._id);
    
    // Join conversation room
    chatService.joinConversation(conversation._id);
    
    // Mark conversation as read
    try {
      await chatService.markConversationAsRead(conversation._id);
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
    }
  };

  const handleSendMessage = useCallback(async (content: string, options: any = {}) => {
    if (!selectedConversation || !content.trim()) return;

    const tempId = `temp_${Date.now()}`;
    const tempMessage: Message = {
      _id: tempId,
      conversationId: selectedConversation._id,
      senderId: user!,
      content: {
        text: content,
        type: 'text'
      },
      timestamp: new Date(),
      deliveryStatus: {
        sent: new Date(),
        delivered: [],
        read: []
      },
      reactions: [],
      priority: 'normal',
      isSystemMessage: false
    };

    // Add temporary message to UI
    setMessages(prev => [...prev, tempMessage]);

    try {
      chatService.sendMessage(selectedConversation._id, {
        text: content,
        type: 'text'
      }, {
        tempId,
        ...options
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    }
  }, [selectedConversation, user]);

  const handleCreateConversation = async (participants: string[], type: 'private' | 'group' = 'private', title?: string) => {
    try {
      const conversation = await chatService.createConversation({
        type,
        participants,
        title
      });
      
      setConversations(prev => [conversation, ...prev]);
      setSelectedConversation(conversation);
      setMessages([]);
      setShowUserSearch(false);
      
      toast.success('Conversation created successfully');
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error('Failed to create conversation');
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-full bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button
              onClick={() => setShowUserSearch(true)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Start new conversation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          {/* Connection status */}
          <div className="flex items-center mt-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            typingUsers={typingUsers.get(selectedConversation._id) || []}
            onlineUsers={onlineUsers}
            currentUser={user!}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* User Search Modal */}
      {showUserSearch && (
        <UserSearch
          onClose={() => setShowUserSearch(false)}
          onCreateConversation={handleCreateConversation}
          currentUserId={user!._id}
        />
      )}
    </div>
  );
};

export default ChatContainer;
