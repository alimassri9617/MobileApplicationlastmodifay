import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './ApiService';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  async initialzize() {
    try {
      // Register for push notifications
      const token = await this.registerForPushNotificationsAsync();
      if (token) {
        this.expoPushToken = token;
        await this.saveTokenToStorage(token);
        await this.sendTokenToBackend(token);
      }

      // Set up notification listeners
      this.setupNotificationListeners();

      return token;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return null;
    }
  }

  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        
        token = (await Notifications.getExpoPushTokenAsync({
          projectId,
        })).data;
        
        console.log('Push notification token:', token);
      } catch (e) {
        console.error('Error getting push token:', e);
        return null;
      }
    } else {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    return token;
  }

  setupNotificationListeners() {
    // Listen for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Listen for user interactions with notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  handleNotificationReceived(notification) {
    // Handle notification received while app is in foreground
    const { title, body, data } = notification.request.content;
    
    // You can add custom logic here based on notification type
    if (data?.type) {
      switch (data.type) {
        case 'message':
          // Handle new message notification
          break;
        case 'announcement':
          // Handle announcement notification
          break;
        case 'appointment':
          // Handle appointment reminder
          break;
        case 'pomodoro':
          // Handle pomodoro timer notification
          break;
        default:
          break;
      }
    }
  }

  handleNotificationResponse(response) {
    // Handle user tapping on notification
    const { notification } = response;
    const { data } = notification.request.content;
    
    // Navigate to appropriate screen based on notification data
    if (data?.screen) {
      // You would use navigation here to go to the specific screen
      console.log('Should navigate to:', data.screen);
    }
  }

  async saveTokenToStorage(token) {
    try {
      await AsyncStorage.setItem('expoPushToken', token);
    } catch (error) {
      console.error('Error saving push token to storage:', error);
    }
  }

  async getTokenFromStorage() {
    try {
      return await AsyncStorage.getItem('expoPushToken');
    } catch (error) {
      console.error('Error getting push token from storage:', error);
      return null;
    }
  }

  async sendTokenToBackend(token) {
    try {
      await ApiService.makeRequest('/notifications/register-token', {
        method: 'POST',
        body: JSON.stringify({ 
          expoPushToken: token,
          platform: Platform.OS,
          deviceId: Constants.deviceId || 'unknown'
        }),
      });
      console.log('Push token sent to backend successfully');
    } catch (error) {
      console.error('Error sending push token to backend:', error);
    }
  }

  async scheduleLocalNotification(title, body, data = {}, trigger = null) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: trigger || null, // null means immediate
      });
      
      console.log('Local notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling local notification:', error);
      return null;
    }
  }

  async cancelLocalNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Local notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling local notification:', error);
    }
  }

  async cancelAllLocalNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All local notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all local notifications:', error);
    }
  }

  // Schedule a pomodoro timer notification
  async schedulePomodoroNotification(type, duration) {
    const title = type === 'work' ? 'Work Session Complete!' : 'Break Time Over!';
    const body = type === 'work' 
      ? 'Great job! Time for a well-deserved break.' 
      : 'Break time is over. Ready to get back to work?';
    
    return await this.scheduleLocalNotification(
      title,
      body,
      { type: 'pomodoro', sessionType: type },
      { seconds: duration }
    );
  }

  // Schedule an appointment reminder
  async scheduleAppointmentReminder(appointment, minutesBefore = 15) {
    const appointmentDate = new Date(appointment.datetime);
    const reminderDate = new Date(appointmentDate.getTime() - (minutesBefore * 60 * 1000));
    
    if (reminderDate > new Date()) {
      return await this.scheduleLocalNotification(
        'Appointment Reminder',
        `You have "${appointment.title}" in ${minutesBefore} minutes`,
        { 
          type: 'appointment', 
          appointmentId: appointment._id,
          screen: 'Appointments'
        },
        { date: reminderDate }
      );
    }
    
    return null;
  }

  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

export default new NotificationService();

