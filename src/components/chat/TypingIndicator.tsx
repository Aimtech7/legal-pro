// Typing Indicator Component - LegalPro v1.0.1
import React from 'react';
import { TypingUser } from '../../services/chatService';

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].user.firstName} is typing`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].user.firstName} and ${typingUsers[1].user.firstName} are typing`;
    } else {
      return `${typingUsers[0].user.firstName} and ${typingUsers.length - 1} others are typing`;
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span>{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicator;
