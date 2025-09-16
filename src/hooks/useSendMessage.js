// import { useState } from 'react';
// import Toast from 'react-native-toast-message';
// import { useConversation } from '../store/useConversation';
// import { useAuthStore } from '../store/AuthStore'; // <-- import auth store

// export const useSendMessage = () => {
//   const [loading, setLoading] = useState(false);
//   const { messages, setMessages, selectedConversation } = useConversation();
//   const token = useAuthStore((state) => state.authUser?.token); // <-- get token

//   const sendMessage = async (message) => {
//     if (!selectedConversation?._id || !token) return;

//     setLoading(true);
//     try {
//       const res = await fetch(`http://127.0.0.1:5000/api/messages/send/${selectedConversation._id}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`, // <-- attach token
//         },
//         body: JSON.stringify({ message }),
//       });

//       const data = await res.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       setMessages([...messages, data]);
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { sendMessage, loading };
// };

import Constants from 'expo-constants';

import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useConversation } from '../store/useConversation';
import { useAuthStore } from '../store/AuthStore';
import { useSocketStore } from '../store/SocketStore';

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const token = useAuthStore((state) => state.authUser?.token);
  const { socket } = useSocketStore();

  const sendMessage = async (messageText) => {
    if (!selectedConversation?._id || !token || !socket) return;

    const newMessage = {
      senderId: 'self', // temporary marker
      receiverId: selectedConversation._id,
      message: messageText,
      createdAt: new Date().toISOString(),
    };

    setLoading(true);
    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/messages/send/${selectedConversation._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // <-- attach token
        },
        body: JSON.stringify({ message: messageText }),
      });

      // Optionally handle response here, e.g.:
      // const data = await res.json();
      // if (data.error) throw new Error(data.error);

      // Optimistically add message
      setMessages([...messages, newMessage]);

      try {
        socket.emit('sendMessage', {
          receiverId: selectedConversation._id,
          message: messageText,
          token, // pass token to validate server-side
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Socket error',
          text2: error.message,
        });
      }
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

  return { sendMessage, loading };
};
