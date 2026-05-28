// User Search Component - LegalPro v1.0.1
import React, { useState, useEffect } from 'react';
import chatService, { User } from '../../services/chatService';
import { toast } from 'react-toastify';

interface UserSearchProps {
  onClose: () => void;
  onCreateConversation: (participants: string[], type: 'private' | 'group', title?: string) => void;
  currentUserId: string;
}

const UserSearch: React.FC<UserSearchProps> = ({
  onClose,
  onCreateConversation,
  currentUserId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationType, setConversationType] = useState<'private' | 'group'>('private');
  const [groupTitle, setGroupTitle] = useState('');

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const users = await chatService.searchUsers(searchQuery, {
        exclude: [currentUserId, ...selectedUsers.map(u => u._id)]
      });
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    if (selectedUsers.find(u => u._id === user._id)) return;
    
    setSelectedUsers(prev => [...prev, user]);
    setSearchResults(prev => prev.filter(u => u._id !== user._id));
    
    // Auto-set to group if more than one user selected
    if (selectedUsers.length >= 1) {
      setConversationType('group');
    }
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u._id !== userId));
    
    // Auto-set to private if only one user left
    if (selectedUsers.length <= 2) {
      setConversationType('private');
    }
  };

  const handleCreateConversation = () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    if (conversationType === 'group' && !groupTitle.trim()) {
      toast.error('Please enter a group title');
      return;
    }

    const participantIds = [currentUserId, ...selectedUsers.map(u => u._id)];
    onCreateConversation(
      participantIds,
      conversationType,
      conversationType === 'group' ? groupTitle : undefined
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Start New Conversation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
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

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Users ({selectedUsers.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div
                    key={user._id}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{user.firstName} {user.lastName}</span>
                    <button
                      onClick={() => handleUserRemove(user._id)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversation Type */}
          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversation Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="private"
                    checked={conversationType === 'private'}
                    onChange={(e) => setConversationType(e.target.value as 'private')}
                    disabled={selectedUsers.length > 1}
                    className="mr-2"
                  />
                  <span className={selectedUsers.length > 1 ? 'text-gray-400' : 'text-gray-700'}>
                    Private
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="group"
                    checked={conversationType === 'group'}
                    onChange={(e) => setConversationType(e.target.value as 'group')}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Group</span>
                </label>
              </div>
            </div>
          )}

          {/* Group Title */}
          {conversationType === 'group' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Title
              </label>
              <input
                type="text"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                placeholder="Enter group title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Search Results */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Results
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery.length < 2 
                    ? 'Type at least 2 characters to search' 
                    : 'No users found'
                  }
                </div>
              ) : (
                searchResults.map(user => (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {user.role}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateConversation}
            disabled={selectedUsers.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
