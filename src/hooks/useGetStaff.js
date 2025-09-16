import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/AuthStore';
import Constants from 'expo-constants';
export const useGetStaff = () => {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);

  const token = useAuthStore((state) => state.authUser?.token);

  useEffect(() => {
    const getStaff = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/users`, {
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
        console.log("Staff data fetched successfully:", data);
        
        setStaff(data.filter(user => user.role === 'teacher' || user.role === 'admin'));
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

    getStaff();
  }, [token]);

  return { loading, staff };
};

