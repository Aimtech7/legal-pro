// Conversation List Component - LegalPro v1.0.1
import React, { useState } from 'react';
import { Conversation, OnlineUser } from '../../services/chatService';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation) => void;
  onlineUsers: Map<string, OnlineUser>;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onConversationSelect,
  onlineUsers
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search in conversation title
    if (conversation.title?.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Search in participant names
    const participantNames = conversation.participants
      .map(p => `${p.userId.firstName} ${p.userId.lastName}`)
      .join(' ')
      .toLowerCase();
    
    if (participantNames.includes(searchLower)) {
      return true;
    }
    
    // Search in last message
    if (conversation.lastMessage?.content?.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    return false;
  });

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.title) {
      return conversation.title;
    }
    
    if (conversation.type === 'private') {
      // For private conversations, show the other participant's name
      const otherParticipant = conversation.participants.find(p => !p.leftAt);
      if (otherParticipant) {
        return `${otherParticipant.userId.firstName} ${otherParticipant.userId.lastName}`;
      }
    }
    
    return 'Conversation';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.avatar) {
      return conversation.avatar;
    }
    
    if (conversation.type === 'private') {
      const otherParticipant = conversation.participants.find(p => !p.leftAt);
      return otherParticipant?.userId.avatar;
    }
    
    return null;
  };

  const isUserOnline = (userId: string) => {
    const userStatus = onlineUsers.get(userId);
    return userStatus?.status === 'online';
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) {
      return 'No messages yet';
    }
    
    const { content, messageType } = conversation.lastMessage;
    
    switch (messageType) {
      case 'file':
        return '📎 File attachment';
      case 'image':
        return '🖼️ Image';
      case 'document':
        return '📄 Document';
      case 'system':
        return content;
      default:
        return content.length > 50 ? `${content.substring(0, 50)}...` : content;
    }
  };

  const formatLastMessageTime = (timestamp: Date) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isSelected = selectedConversation?._id === conversation._id;
            const title = getConversationTitle(conversation);
            const avatar = getConversationAvatar(conversation);
            const lastMessagePreview = getLastMessagePreview(conversation);
            const lastMessageTime = conversation.lastMessage 
              ? formatLastMessageTime(conversation.lastMessage.timestamp)
              : '';

            // Check if any participant is online (for private conversations)
            const hasOnlineParticipant = conversation.type === 'private' 
              ? conversation.participants.some(p => !p.leftAt && isUserOnline(p.userId._id))
              : false;

            return (
              <div
                key={conversation._id}
                onClick={() => onConversationSelect(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={title}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-lg">
                          {title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Online indicator for private conversations */}
                    {conversation.type === 'private' && hasOnlineParticipant && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    
                    {/* Group conversation indicator */}
                    {conversation.type === 'group' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium truncate ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {title}
                      </h3>
                      {lastMessageTime && (
                        <span className={`text-xs ${
                          isSelected ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {lastMessageTime}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-sm truncate ${
                        isSelected ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {lastMessagePreview}
                      </p>
                      
                      {/* Unread count */}
                      {conversation.unreadCount && conversation.unreadCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Conversation type and participant count for groups */}
                    {conversation.type === 'group' && (
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {conversation.participants.filter(p => !p.leftAt).length} participants
                        </span>
                      </div>
                    )}

                    {/* Case link for case conversations */}
                    {conversation.type === 'case' && conversation.caseId && (
                      <div className="flex items-center mt-1">
                        <svg className="w-3 h-3 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-500">Case conversation</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
