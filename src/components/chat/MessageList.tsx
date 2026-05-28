// Message List Component - LegalPro v1.0.1
import React from 'react';
import { Message, User, Conversation } from '../../services/chatService';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  conversation: Conversation;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  conversation
}) => {
  const formatMessageTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageDate = (timestamp: Date) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const shouldShowDateSeparator = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();
    
    return currentDate !== previousDate;
  };

  const shouldShowSenderName = (currentMessage: Message, previousMessage?: Message) => {
    if (conversation.type === 'private') return false;
    if (currentMessage.senderId._id === currentUser._id) return false;
    if (!previousMessage) return true;
    
    return currentMessage.senderId._id !== previousMessage.senderId._id;
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg">No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {messages.map((message, index) => {
        const previousMessage = index > 0 ? messages[index - 1] : undefined;
        const isOwnMessage = message.senderId._id === currentUser._id;
        const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
        const showSenderName = shouldShowSenderName(message, previousMessage);

        return (
          <div key={message._id}>
            {/* Date separator */}
            {showDateSeparator && (
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {formatMessageDate(message.timestamp)}
                </div>
              </div>
            )}

            {/* Message */}
            <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-1`}>
              <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                {/* Sender name */}
                {showSenderName && (
                  <div className="text-xs text-gray-500 mb-1 px-1">
                    {message.senderId.firstName} {message.senderId.lastName}
                  </div>
                )}

                {/* Message bubble */}
                <div className={`px-4 py-2 rounded-lg ${
                  isOwnMessage 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-gray-200 text-gray-900 rounded-bl-sm'
                }`}>
                  {/* System message */}
                  {message.isSystemMessage ? (
                    <p className="text-sm italic">{message.content.text}</p>
                  ) : (
                    <>
                      {/* Regular message content */}
                      {message.content.type === 'text' && (
                        <p className="text-sm whitespace-pre-wrap">{message.content.text}</p>
                      )}

                      {/* File attachment */}
                      {message.content.type === 'file' && message.content.attachments && (
                        <div className="space-y-2">
                          {message.content.attachments.map((attachment, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <span className="text-sm">{attachment.originalName}</span>
                            </div>
                          ))}
                          {message.content.text && (
                            <p className="text-sm mt-2">{message.content.text}</p>
                          )}
                        </div>
                      )}

                      {/* Image attachment */}
                      {message.content.type === 'image' && message.content.attachments && (
                        <div className="space-y-2">
                          {message.content.attachments.map((attachment, idx) => (
                            <div key={idx}>
                              <img 
                                src={attachment.url} 
                                alt={attachment.originalName}
                                className="max-w-full h-auto rounded"
                              />
                            </div>
                          ))}
                          {message.content.text && (
                            <p className="text-sm mt-2">{message.content.text}</p>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Message reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.reactions.map((reaction, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-white bg-opacity-20 rounded-full px-2 py-1"
                        >
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message time and status */}
                  <div className={`flex items-center justify-between mt-1 text-xs ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <span>{formatMessageTime(message.timestamp)}</span>
                    
                    {/* Delivery status for own messages */}
                    {isOwnMessage && (
                      <div className="flex items-center space-x-1">
                        {message.editedAt && (
                          <span className="italic">edited</span>
                        )}
                        
                        {/* Delivery indicators */}
                        {message.deliveryStatus.read.length > 0 ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : message.deliveryStatus.delivered.length > 0 ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
