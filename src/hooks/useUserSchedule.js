import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/AuthStore';
import Constants from 'expo-constants';
export const useUserSchedule = () => {






  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState([]);

  const token = useAuthStore((state) => state.authUser?.token);
  const userId = useAuthStore((state) => state.authUser?._id); // assuming _id is stored

  useEffect(() => {
    const getUserSchedule = async () => {
      if (!token || !userId) return;

      setLoading(true);
      try {
        const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/sch/${userId}/schedule`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.status !== 200) {
          throw new Error(data.message || 'Failed to fetch schedule');
        }

        setSchedule(data);
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

    getUserSchedule();
  }, [token, userId]);

  return { loading, schedule };
};
