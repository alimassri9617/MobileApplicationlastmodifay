import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { useAuthStore } from '../../store/AuthStore';
import axios from 'axios';
import Constants from 'expo-constants';
// Define the correct weekday order
const weekdayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const ScheduleScreen = () => {
  const token = useAuthStore((state) => state.authUser?.token);
  const id = useAuthStore((state) => state.authUser?._id);

  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `${Constants.expoConfig.extra.API_BASE_URL}/sch/${id}/schedule`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setScheduleData(response.data || []);
      } catch (error) {
        setScheduleData([]);
      } finally {
        setLoading(false);
      }
    };
    if (token && id) {
      fetchSchedule();
    }
  }, [token, id]);

  // Group and order by weekday
  const schedule = weekdayOrder.map((day) => ({
    day,
    items: scheduleData.filter((item) => item.day === day),
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading schedule...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Weekly Schedule</Text>
      {schedule.map(
        ({ day, items }) =>
          items.length > 0 && (
            <View key={day} style={styles.daySection}>
              <Text style={styles.dayHeader}>{day}</Text>
              {items.map((item) => (
                <Card key={item._id} style={styles.card}>
                  <Card.Content>
                    <Text>{item.subject}</Text>
                    <View style={styles.chipRow}>
                      <Chip style={styles.chip}>{item.startTime}</Chip>
                      <Chip style={styles.chip}>{item.endTime}</Chip>
                    </View>
                    <Text>{item.mode}</Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          )
      )}
    </ScrollView>
  );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  daySection: {
    marginBottom: 24,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
