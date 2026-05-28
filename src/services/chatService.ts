// Chat Service for Real-time Chat System - LegalPro v1.0.1
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

// Create axios instance for chat API calls
const chatApi = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000',
});

// Add auth token to requests
chatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface Participant {
  userId: User;
  role: 'member' | 'admin' | 'moderator';
  joinedAt: Date;
  leftAt?: Date;
  permissions: string[];
  lastReadAt: Date;
  notificationsEnabled: boolean;
}

export interface Conversation {
  _id: string;
  type: 'private' | 'group' | 'case' | 'support';
  participants: Participant[];
  caseId?: string;
  title?: string;
  description?: string;
  avatar?: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
    messageType: string;
  };
  messageCount: number;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  unreadCount?: number;
}

export interface MessageContent {
  text?: string;
  type: 'text' | 'file' | 'image' | 'document' | 'system';
  attachments?: Attachment[];
  formatting?: MessageFormatting;
}

export interface Attachment {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
}

export interface MessageFormatting {
  bold?: { start: number; end: number }[];
  italic?: { start: number; end: number }[];
  code?: { start: number; end: number }[];
  links?: { start: number; end: number; url: string }[];
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: User;
  content: MessageContent;
  timestamp: Date;
  editedAt?: Date;
  deletedAt?: Date;
  deliveryStatus: {
    sent: Date;
    delivered: { userId: string; timestamp: Date }[];
    read: { userId: string; timestamp: Date }[];
  };
  reactions: { userId: string; emoji: string; timestamp: Date }[];
  replyTo?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isSystemMessage: boolean;
  systemMessageType?: string;
}

export interface TypingUser {
  userId: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface OnlineUser {
  userId: string;
  status: 'online' | 'offline';
  lastSeen: Date;
}

// Socket Events
export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Message events
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_DELIVERED: 'message_delivered',
  MESSAGE_READ: 'message_read',
  
  // Typing events
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  
  // Conversation events
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
  CONVERSATION_JOINED: 'conversation_joined',
  CONVERSATION_LEFT: 'conversation_left',
  USER_JOINED_CONVERSATION: 'user_joined_conversation',
  USER_LEFT_CONVERSATION: 'user_left_conversation',
  
  // Status events
  USER_STATUS_CHANGE: 'user_status_change',
  GET_ONLINE_USERS: 'get_online_users',
  ONLINE_USERS: 'online_users',
  
  // Reaction events
  ADD_REACTION: 'add_reaction',
  REMOVE_REACTION: 'remove_reaction',
  REACTION_ADDED: 'reaction_added',
  REACTION_REMOVED: 'reaction_removed',
  
  // Error events
  ERROR: 'error',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded'
};

class ChatService {
  private socket: Socket | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event listeners
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.setupEventListeners();
  }

  // Connection management
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
      
      this.socket = io(serverUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.socket.on('connect', () => {
        console.log('Connected to chat server');
        this.connected = true;
        this.reconnectAttempts = 0;
        this.emit('connected');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.connected = false;
        this.emit('connection_error', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from chat server:', reason);
        this.connected = false;
        this.emit('disconnected', reason);
        
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          this.handleReconnection();
        }
      });

      this.setupSocketEventHandlers();
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  private handleReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
      
      setTimeout(() => {
        if (this.socket && !this.socket.connected) {
          this.socket.connect();
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_attempts_reached');
    }
  }

  private setupSocketEventHandlers(): void {
    if (!this.socket) return;

    // Message events
    this.socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data) => {
      this.emit('message_received', data);
    });

    this.socket.on(SOCKET_EVENTS.MESSAGE_SENT, (data) => {
      this.emit('message_sent', data);
    });

    this.socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, (data) => {
      this.emit('message_delivered', data);
    });

    this.socket.on(SOCKET_EVENTS.MESSAGE_READ, (data) => {
      this.emit('message_read', data);
    });

    // Typing events
    this.socket.on(SOCKET_EVENTS.TYPING_START, (data) => {
      this.emit('typing_start', data);
    });

    this.socket.on(SOCKET_EVENTS.TYPING_STOP, (data) => {
      this.emit('typing_stop', data);
    });

    // Status events
    this.socket.on(SOCKET_EVENTS.USER_STATUS_CHANGE, (data) => {
      this.emit('user_status_change', data);
    });

    this.socket.on(SOCKET_EVENTS.ONLINE_USERS, (data) => {
      this.emit('online_users', data);
    });

    // Reaction events
    this.socket.on(SOCKET_EVENTS.REACTION_ADDED, (data) => {
      this.emit('reaction_added', data);
    });

    this.socket.on(SOCKET_EVENTS.REACTION_REMOVED, (data) => {
      this.emit('reaction_removed', data);
    });

    // Error events
    this.socket.on(SOCKET_EVENTS.ERROR, (data) => {
      this.emit('error', data);
    });

    this.socket.on(SOCKET_EVENTS.RATE_LIMIT_EXCEEDED, (data) => {
      this.emit('rate_limit_exceeded', data);
    });
  }

  // Event management
  private setupEventListeners(): void {
    this.eventListeners = new Map();
  }

  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback?: Function): void {
    if (!this.eventListeners.has(event)) return;
    
    if (callback) {
      const listeners = this.eventListeners.get(event)!;
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    } else {
      this.eventListeners.delete(event);
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Message operations
  sendMessage(conversationId: string, content: MessageContent, options: {
    replyTo?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    tempId?: string;
  } = {}): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to chat server');
    }

    this.socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      conversationId,
      content,
      ...options
    });
  }

  markMessageAsDelivered(messageId: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit(SOCKET_EVENTS.MESSAGE_DELIVERED, { messageId });
  }

  markMessageAsRead(messageId: string, conversationId?: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit(SOCKET_EVENTS.MESSAGE_READ, { messageId, conversationId });
  }

  // Typing indicators
  startTyping(conversationId: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId });
  }

  stopTyping(conversationId: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
  }

  // Conversation operations
  joinConversation(conversationId: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId });
  }

  leaveConversation(conversationId: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { conversationId });
  }

  // Reactions
  addReaction(messageId: string, emoji: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit(SOCKET_EVENTS.ADD_REACTION, { messageId, emoji });
  }

  removeReaction(messageId: string, emoji: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit(SOCKET_EVENTS.REMOVE_REACTION, { messageId, emoji });
  }

  // Status
  getOnlineUsers(conversationId?: string): void {
    if (!this.socket?.connected) return;
    
    this.socket.emit(SOCKET_EVENTS.GET_ONLINE_USERS, { conversationId });
  }

  // REST API methods
  async getConversations(params: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
    caseId?: string;
  } = {}): Promise<{ data: Conversation[]; pagination: any }> {
    const response = await chatApi.get('/api/chat/conversations', { params });
    return response.data;
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await chatApi.get(`/api/chat/conversations/${conversationId}`);
    return response.data;
  }

  async createConversation(conversationData: {
    type: 'private' | 'group' | 'case' | 'support';
    participants: string[];
    title?: string;
    description?: string;
    caseId?: string;
  }): Promise<Conversation> {
    const response = await chatApi.post('/api/chat/conversations', conversationData);
    return response.data;
  }

  async getMessages(conversationId: string, params: {
    page?: number;
    limit?: number;
    before?: string;
    after?: string;
    search?: string;
  } = {}): Promise<{ data: Message[]; pagination: any }> {
    const response = await chatApi.get(`/api/chat/conversations/${conversationId}/messages`, { params });
    return response.data;
  }

  async searchUsers(query: string, options: {
    limit?: number;
    exclude?: string[];
  } = {}): Promise<User[]> {
    const response = await chatApi.get('/api/chat/users/search', {
      params: { query, ...options }
    });
    return response.data;
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    await chatApi.put(`/api/chat/conversations/${conversationId}/read`);
  }

  // Utility methods
  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' | 'reconnecting' {
    if (!this.socket) return 'disconnected';
    if (this.socket.connected) return 'connected';
    if (this.socket.connecting) return 'connecting';
    if (this.reconnectAttempts > 0) return 'reconnecting';
    return 'disconnected';
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService;
