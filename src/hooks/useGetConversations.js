import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/AuthStore';

export const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  const token = useAuthStore((state) => state.authUser?.token);

  useEffect(() => {
    const getConversations = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/messages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Sending token:', token);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch conversations');
        }

        setConversations(data);
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

    getConversations();
  }, [token]);

  return { loading, conversations };
};
