# UniAssist Mobile - Enhanced Version

## Overview
This is the enhanced version of the UniAssist Mobile application with complete feature parity to the web version, plus additional mobile-specific enhancements.

## New Features Added

### 📱 Complete Feature Set
- **Lost & Found**: Post and search for lost/found items with categories and filters
- **Notes App**: Create, edit, and organize notes with categories and search
- **Pomodoro Timer**: Productivity timer with customizable settings and statistics
- **Appointments**: Schedule and manage appointments with reminder notifications

### 🔔 Push Notifications
- **Expo Notifications**: Integrated push notification system
- **Local Notifications**: For Pomodoro timer completions and appointment reminders
- **Background Support**: Notifications work even when app is in background
- **Customizable Settings**: Users can enable/disable sounds and vibrations

### ⚙️ Environment Configuration
- **Environment Variables**: Configurable API endpoints and settings
- **Development/Production**: Separate configurations for different environments
- **Feature Flags**: Enable/disable features via environment variables
- **Debug Mode**: Configurable logging and debugging options

### 🎨 Enhanced UI/UX
- **Consistent Design**: Material Design with React Native Paper
- **Responsive Layout**: Works on different screen sizes
- **Loading States**: Proper loading indicators and error handling
- **Toast Messages**: User-friendly feedback for all actions

## Technical Improvements

### 🏗️ Architecture
- **Modular Structure**: Well-organized component and service structure
- **State Management**: Zustand for efficient state management
- **API Service**: Centralized API handling with error management
- **Configuration**: Environment-based configuration system

### 🔧 Dependencies
- **React Native**: 0.73.0
- **Expo**: ~50.0.0
- **React Navigation**: Latest version with drawer and stack navigation
- **React Native Paper**: Material Design components
- **Socket.IO**: Real-time communication
- **Expo Notifications**: Push notification support

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- React Native development environment

### Installation
1. Navigate to the UniAssistMobile directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Environment Variables
Copy `.env.example` to `.env` and configure:

- `API_BASE_URL`: Backend API URL
- `SOCKET_URL`: Socket.IO server URL
- `EXPO_PROJECT_ID`: Your Expo project ID for push notifications
- `DEBUG_MODE`: Enable/disable debug logging
- Feature flags for enabling/disabling specific features

## Features Overview

### 🏠 Dashboard
- Quick access to all features
- Recent activity overview
- Navigation shortcuts

### 💬 Chat & Messaging
- Real-time messaging with Socket.IO
- User presence indicators
- Message history and search

### 👥 Staff Directory
- Browse university staff information
- Search and filter capabilities
- Contact information access

### 📅 Schedule Management
- View personal schedule
- Create and manage events
- Calendar integration

### ✅ Todo Management
- Create and organize tasks
- Mark completion status
- Priority and category management

### 📢 Announcements
- View university announcements
- Real-time updates
- Important notifications

### 🤖 AI Chatbot
- Intelligent assistance
- Natural language processing
- Context-aware responses

### 🔍 Lost & Found (NEW)
- Post lost/found items
- Search with filters
- Category-based organization
- Contact information for claims

### 📝 Notes App (NEW)
- Create and edit notes
- Category organization
- Search functionality
- Rich text support

### ⏰ Pomodoro Timer (NEW)
- Customizable work/break intervals
- Statistics tracking
- Sound and vibration alerts
- Background timer support

### 📋 Appointments (NEW)
- Schedule appointments
- Reminder notifications
- Priority levels
- Calendar integration

## Push Notifications

### Setup
1. Configure `EXPO_PROJECT_ID` in `.env`
2. The app automatically requests notification permissions
3. Push tokens are registered with the backend

### Features
- **Pomodoro Notifications**: Timer completion alerts
- **Appointment Reminders**: 15-minute advance notifications
- **Message Notifications**: New message alerts
- **Announcement Notifications**: Important updates

### Customization
Users can control:
- Sound notifications on/off
- Vibration on/off
- Notification timing for appointments

## Development Notes

### Code Structure
```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
├── constants/          # App constants and themes
├── hooks/              # Custom React hooks
├── navigation/         # Navigation configuration
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   └── main/          # Main app screens
├── services/          # API and external services
├── store/             # State management
└── utils/             # Utility functions
```

### Key Services
- **ApiService**: Centralized API communication
- **NotificationService**: Push notification handling
- **SocketStore**: Real-time communication management

### State Management
- **AuthStore**: User authentication state
- **SocketStore**: Socket connection and online users
- **ConversationStore**: Chat and messaging state

## Testing

The app has been tested for:
- ✅ UI rendering and responsiveness
- ✅ Navigation flow
- ✅ API integration (with mock data)
- ✅ Environment variable loading
- ✅ Error handling and user feedback
- ✅ Push notification setup

## Deployment

### Web Version
```bash
npm run web
```

### Mobile Development
```bash
# Android
npm run android

# iOS
npm run ios
```

### Production Build
Follow Expo's build and deployment guidelines for production releases.

## Support

For issues or questions:
1. Check the `.env.example` for proper configuration
2. Ensure all dependencies are installed
3. Verify backend API connectivity
4. Check Expo documentation for platform-specific issues

## License
This project is part of the UniAssist system and follows the same licensing terms.

