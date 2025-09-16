import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useAuthStore } from './src/store/AuthStore';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import { theme } from './src/constants/theme';
import NotificationService from './src/services/NotificationService';

export default function App() {
  const { authUser, loading } = useAuthStore();

  // useEffect(() => {
  //   // Initialize notification service when app starts
  //   const initializeNotifications = async () => {
  //     try {
  //       await NotificationService.initialize();
  //     } catch (error) {
  //       console.error('Failed to initialize notifications:', error);
  //     }
  //   };

  //   initializeNotifications();

  //   // Cleanup notification listeners when app unmounts
  //   return () => {
  //     NotificationService.cleanup();
  //   };
  // }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="auto" />
        {authUser ? <MainNavigator /> : <AuthNavigator />}
        <Toast />
      </NavigationContainer>
    </PaperProvider>
  );
}

