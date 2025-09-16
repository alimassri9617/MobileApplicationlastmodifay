import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Avatar, IconButton, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { useAuthStore } from '../../store/AuthStore';
import { useSocketStore } from '../../store/SocketStore';





import Constants from 'expo-constants';

const NotificationsScreen = () => {
  const { authUser } = useAuthStore();
  const { socket, connectSocket } = useSocketStore();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${Constants.expoConfig.extra.API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${Constants.expoConfig.extra.API_BASE_URL}/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${Constants.expoConfig.extra.API_BASE_URL}/notifications/markRead`, {}, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  useEffect(() => {
    if (authUser?._id) {
      connectSocket(authUser._id);
    }

    fetchNotifications();

    // Listen for new notifications via socket
    if (socket && !socket.hasListeners('receiveNotification')) {
      socket.on('receiveNotification', (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
      });
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off('receiveNotification');
      }
    };
  }, [authUser, socket]);

  const renderItem = ({ item }) => (
    <Card
      style={{
        margin: 10,
        backgroundColor: item.read ? '#f0f0f0' : '#e3f2fd',
      }}
      onPress={() => markAsRead(item._id)}
    >
      <Card.Title
        title={`${item.sender?.firstName || 'System'} - ${item.type}`}
        subtitle={item.message}
        left={(props) =>
          item.sender?.profilePic ? (
            <Avatar.Image
              {...props}
              source={{ uri: item.sender.profilePic }}
            />
          ) : (
            <Avatar.Text {...props} label={item.sender?.firstName?.charAt(0) || 'S'} />
          )
        }
        right={(props) =>
          !item.read ? <IconButton {...props} icon="check" onPress={() => markAsRead(item._id)} /> : null
        }
      />
    </Card>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            fetchNotifications();
          }} />
        }
      />
      {notifications.some((n) => !n.read) && (
        <IconButton
          icon="check-all"
          size={28}
          onPress={markAllAsRead}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#2196f3',
            borderRadius: 30,
          }}
          iconColor="white"
        />
      )}
    </View>
  );
};

export default NotificationsScreen;
