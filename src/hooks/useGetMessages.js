import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useConversation } from '../store/useConversation';
import { useAuthStore } from '../store/AuthStore'; // <-- import auth store

export const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const token = useAuthStore((state) => state.authUser?.token); // <-- get token

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id || !token) return;

      setLoading(true);
      try {
        const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/messages/${selectedConversation._id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // <-- attach token
          },
        });

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setMessages(data);
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

    getMessages();
  }, [selectedConversation?._id, token]);

  return { messages, loading };
};
