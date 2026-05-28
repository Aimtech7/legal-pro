// Chat Window Component - LegalPro v1.0.1
import React, { useRef, useEffect } from 'react';
import { Conversation, Message, TypingUser, OnlineUser, User } from '../../services/chatService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string, options?: any) => void;
  typingUsers: TypingUser[];
  onlineUsers: Map<string, OnlineUser>;
  currentUser: User;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onSendMessage,
  typingUsers,
  onlineUsers,
  currentUser
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getConversationTitle = () => {
    if (conversation.title) {
      return conversation.title;
    }
    
    if (conversation.type === 'private') {
      const otherParticipant = conversation.participants.find(
        p => !p.leftAt && p.userId._id !== currentUser._id
      );
      if (otherParticipant) {
        return `${otherParticipant.userId.firstName} ${otherParticipant.userId.lastName}`;
      }
    }
    
    return 'Conversation';
  };

  const getConversationSubtitle = () => {
    if (conversation.type === 'private') {
      const otherParticipant = conversation.participants.find(
        p => !p.leftAt && p.userId._id !== currentUser._id
      );
      
      if (otherParticipant) {
        const userStatus = onlineUsers.get(otherParticipant.userId._id);
        if (userStatus?.status === 'online') {
          return 'Online';
        } else if (userStatus?.lastSeen) {
          return `Last seen ${new Date(userStatus.lastSeen).toLocaleString()}`;
        }
      }
      
      return 'Offline';
    }
    
    if (conversation.type === 'group') {
      const activeParticipants = conversation.participants.filter(p => !p.leftAt);
      return `${activeParticipants.length} participants`;
    }
    
    return '';
  };

  const isUserOnline = (userId: string) => {
    const userStatus = onlineUsers.get(userId);
    return userStatus?.status === 'online';
  };

  const title = getConversationTitle();
  const subtitle = getConversationSubtitle();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {title.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {conversation.type === 'private' && (
              (() => {
                const otherParticipant = conversation.participants.find(
                  p => !p.leftAt && p.userId._id !== currentUser._id
                );
                const isOnline = otherParticipant && isUserOnline(otherParticipant.userId._id);
                
                return isOnline ? (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                ) : null;
              })()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-600 truncate">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Video call"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            <button
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="More options"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUser={currentUser}
          conversation={conversation}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <TypingIndicator typingUsers={typingUsers} />
        </div>
      )}

      {/* Message input */}
      <div className="border-t border-gray-200 bg-white">
        <MessageInput
          onSendMessage={onSendMessage}
          conversationId={conversation._id}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
