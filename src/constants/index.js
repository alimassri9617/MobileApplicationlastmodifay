// App Configuration
export const APP_CONFIG = {
  name: 'UniAssist Mobile',
  version: '1.0.0',
  description: 'University Assistance Mobile Application',
};

// API Configuration
export const API_CONFIG = {
  baseURL: 'http://localhost:5000/api',
  socketURL: 'http://localhost:5000',
  timeout: 10000,
};

// Storage Keys
export const STORAGE_KEYS = {
  authUser: 'chat-user-storage',
  userPreferences: 'user-preferences',
  appSettings: 'app-settings',
};

// Screen Names
export const SCREEN_NAMES = {
  // Auth Screens
  LOGIN: 'Login',
  SIGNUP: 'SignUp',
  
  // Main Screens
  DASHBOARD: 'Dashboard',
  CHAT: 'Chat',
  STAFF_LIST: 'Staff List',
  SCHEDULE: 'Schedule',
  TODO_LIST: 'Todo List',
  ANNOUNCEMENTS: 'Announcements',
  AI_CHATBOT: 'AI Chatbot',
  
  // Navigation
  MAIN_DRAWER: 'MainDrawer',
};

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin',
};

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Todo Status
export const TODO_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Announcement Categories
export const ANNOUNCEMENT_CATEGORIES = {
  ACADEMIC: 'Academic',
  SERVICES: 'Services',
  EVENTS: 'Events',
  EMERGENCY: 'Emergency',
  GENERAL: 'General',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  AUTHENTICATION_FAILED: 'Authentication failed. Please check your credentials.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  MESSAGE_SENT: 'Message sent successfully.',
  TODO_CREATED: 'Todo item created successfully.',
  TODO_UPDATED: 'Todo item updated successfully.',
  TODO_DELETED: 'Todo item deleted successfully.',
  ANNOUNCEMENT_CREATED: 'Announcement created successfully.',
  USER_REGISTERED: 'User registered successfully.',
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  UNI_ID_REGEX: /^[A-Za-z0-9]{6,12}$/,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm',
  FULL: 'YYYY-MM-DD HH:mm:ss',
};

// Dimensions
export const DIMENSIONS = {
  HEADER_HEIGHT: 60,
  TAB_BAR_HEIGHT: 60,
  BUTTON_HEIGHT: 48,
  INPUT_HEIGHT: 56,
  AVATAR_SIZE: {
    SMALL: 32,
    MEDIUM: 48,
    LARGE: 64,
    EXTRA_LARGE: 80,
  },
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Network Status
export const NETWORK_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  CONNECTING: 'connecting',
  RECONNECTING: 'reconnecting',
};

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  NEW_MESSAGE: 'newMessage',
  GET_ONLINE_USERS: 'getOnlineUsers',
  USER_TYPING: 'userTyping',
  USER_STOPPED_TYPING: 'userStoppedTyping',
};

// File Types
export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  AUDIO: ['mp3', 'wav', 'aac', 'm4a'],
  VIDEO: ['mp4', 'mov', 'avi', 'mkv'],
};

// Maximum File Sizes (in bytes)
export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  AUDIO: 20 * 1024 * 1024, // 20MB
  VIDEO: 50 * 1024 * 1024, // 50MB
};

// Notification Types
export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  ANNOUNCEMENT: 'announcement',
  SCHEDULE: 'schedule',
  TODO: 'todo',
  SYSTEM: 'system',
};

// App States
export const APP_STATES = {
  ACTIVE: 'active',
  BACKGROUND: 'background',
  INACTIVE: 'inactive',
};

export default {
  APP_CONFIG,
  API_CONFIG,
  STORAGE_KEYS,
  SCREEN_NAMES,
  USER_ROLES,
  MESSAGE_TYPES,
  PRIORITY_LEVELS,
  TODO_STATUS,
  ANNOUNCEMENT_CATEGORIES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  DATE_FORMATS,
  DIMENSIONS,
  ANIMATION_DURATION,
  NETWORK_STATUS,
  SOCKET_EVENTS,
  FILE_TYPES,
  MAX_FILE_SIZES,
  NOTIFICATION_TYPES,
  APP_STATES,
};

