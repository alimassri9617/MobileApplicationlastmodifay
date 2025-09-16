import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/AuthStore';
import Constants from 'expo-constants';
export const usePomodoro = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    todaySessions: 0,
    todayMinutes: 0,
    weekSessions: 0,
    weekMinutes: 0,
  });

  const token = useAuthStore((state) => state.authUser?.token);

  useEffect(() => {
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/pomodoro/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setStats(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const recordSession = async (sessionData) => {
    if (!token) return;

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/pomodoro/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // Refresh stats after recording session
      fetchStats();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Pomodoro session recorded',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  return { 
    loading, 
    stats, 
    fetchStats, 
    recordSession 
  };
};

