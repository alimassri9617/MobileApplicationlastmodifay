// screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput as RNTextInput,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  Avatar,
  Portal,
  Modal,
} from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/AuthStore';
import axios from 'axios'; // ✅ FIXED
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

const features = [
  { name: 'ChatApp', description: 'Connect with fellow students and staff instantly with real-time messaging.', icon: 'chatbubble-ellipses-outline', badge: 'Popular', color: 'blue' },
  { name: 'Lost & Found', description: 'Easily report or find lost items on campus with smart matching.', icon: 'search-outline', badge: 'New', color: 'skyblue' },
  { name: 'Staff Directory', description: 'Access comprehensive directory with contact info and office hours.', icon: 'people-outline', badge: 'Essential', color: 'blue' },
  { name: 'Appointments', description: 'Schedule and manage meetings with teachers effortlessly.', icon: 'calendar-outline', badge: 'Smart', color: 'skyblue' },
  { name: 'Announcements', description: 'Stay updated with events, exams, and important notices.', icon: 'megaphone-outline', badge: 'Live', color: 'blue' },
  { name: 'AI Assistant', description: 'Get instant answers to your frequently asked questions.', icon: 'help-circle-outline', badge: 'AI-Powered', color: 'skyblue' },
  { name: 'Cafeteria Menu', description: 'View daily menus, nutrition info, and special offerings.', icon: 'restaurant-outline', badge: 'Daily', color: 'blue' },
  { name: 'Study Tools', description: 'Pomodoro timer, note-taking, and todo lists for productivity.', icon: 'construct-outline', badge: 'Pro', color: 'skyblue' },
];

// ✅ Hook inside file
const useContactForm = () => {
  const token = useAuthStore((state) => state.authUser?.token);
  const [loading, setLoading] = useState(false);

  const createContactMessage = async ({ title, description, category }) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${Constants.expoConfig.extra.API_BASE_URL}/contact`,
        { title, description, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  return { createContactMessage, loading };
};

const DashboardScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');

  const { createContactMessage, loading } = useContactForm();

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Validation Error', 'Title and description are required.');
      return;
    }

    const { success, message } = await createContactMessage({
      title,
      description,
      category,
    });

    if (success) {
      Alert.alert('Message Sent', message);
      setTitle('');
      setDescription('');
      setCategory('other');
      setShowForm(false);
    } else {
      Alert.alert('Error', message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroSection}>
        <Ionicons name="school-outline" size={80} color="white" />
        <Text style={styles.heroTitle}>UniAssist</Text>
        <Text style={styles.heroSubtitle}>Your Ultimate University Companion</Text>
        <Paragraph style={styles.heroDesc}>
          UniAssist is designed to streamline your university life, connecting you with resources,
          people, and tools you need to succeed.
        </Paragraph>
        <Button mode="contained" onPress={() => setShowForm(true)} style={styles.contactBtn}>
          Contact Us
        </Button>

        <Portal>
          <Modal
            visible={showForm}
            onDismiss={() => setShowForm(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Title>Contact Us</Title>
            <RNTextInput
              placeholder="Enter your message title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              maxLength={100}
            />
            <RNTextInput
              placeholder="Enter your message description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={styles.input}
              maxLength={2000}
            />
            <RNTextInput
              placeholder="Category (e.g., bug, help, feedback)"
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.contactBtn}
            >
              Submit
            </Button>
          </Modal>
        </Portal>
      </View>

      <Text style={styles.sectionTitle}>Features</Text>
      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <View style={styles.chipWrapper}>
                <Chip style={{ backgroundColor: feature.color }}>{feature.badge}</Chip>
              </View>
              <Avatar.Icon
                size={48}
                icon={feature.icon}
                style={{ backgroundColor: 'transparent' }}
              />
              <Title style={styles.cardTitle}>{feature.name}</Title>
              <Paragraph style={styles.cardDesc}>{feature.description}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} UniAssist. All rights reserved.</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white', opacity: 0.9 }}>Made with ❤️ for students</Text>
          <MaterialIcons name="trending-up" size={16} color="white" style={{ marginLeft: 4 }} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#f8f9fa',
  },
  heroSection: {
    backgroundColor: '#1976d2',
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  heroSubtitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  heroDesc: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  contactBtn: {
    marginTop: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  card: {
    width: width / 2.2,
    marginVertical: 10,
    elevation: 4,
    borderRadius: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  cardDesc: {
    marginTop: 4,
  },
  chipWrapper: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  footer: {
    backgroundColor: '#1565c0',
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    marginBottom: 4,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  input: {
    backgroundColor: 'white',
    marginVertical: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
});

export default DashboardScreen;
