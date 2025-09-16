import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator, Text } from 'react-native-paper';
import { useAuthStore } from '../../store/AuthStore';
import axios from 'axios';



import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
const API_BASE_URL = `${Constants.expoConfig.extra.API_BASE_URL}/contact`;

const ContactMessagesScreen = () => {
  const { authUser } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      setMessages(res.data.data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to load contact messages.');
    } finally {
      setLoading(false);
    }
  };

const deleteMessage = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${authUser?.token}`,
            },
        });
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        // Show toast on success
        if (global?.toast) {
            global.toast.show('Message deleted successfully', { type: 'success' });
        }
    } catch (err) {
        console.error('Delete error:', err.response?.data || err.message);
        if (global?.toast) {
            global.toast.show('Failed to delete message.', { type: 'danger' });
        }
    }
};

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} animating size="large" />;
  }

  if (messages.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No contact messages found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={messages}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Content>
            <Title>{item.title}</Title>
            <Paragraph>{item.description}</Paragraph>
            <Paragraph>Category: {item.category}</Paragraph>
            <Paragraph>
              From: {item.user?.firstName} {item.user?.lastName}
            </Paragraph>
            <Paragraph>Email: {item.user?.email}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => deleteMessage(item._id)} textColor="red">
              Delete
            </Button>
          </Card.Actions>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 12,
  },
  center: {
    marginTop: 50,
    alignItems: 'center',
  },
});

export default ContactMessagesScreen;
