// Messages and chat page for LegalPro v1.0.1
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatContainer from '../components/chat/ChatContainer';
import chatService from '../services/chatService';

const Messages = () => {
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      // Initialize chat service when component mounts
      chatService.connect(token).catch(error => {
        console.error('Failed to connect to chat service:', error);
      });
    }

    return () => {
      // Cleanup on unmount
      chatService.disconnect();
    };
  }, [user, token]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>
          <p className="text-gray-600">Please log in to access your messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Communicate securely with your legal team and clients</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg" style={{ height: 'calc(100vh - 200px)' }}>
        <ChatContainer className="h-full" />
      </div>
    </div>
  );
};

export default Messages;