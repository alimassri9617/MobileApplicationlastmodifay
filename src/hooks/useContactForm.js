// import { useState } from 'react';
// import axios from 'axios';
// import { useAuthStore } from '../zustand/AuthStore'; // Update path as needed
// import { Alert } from 'react-native';

// export const useContactForm = () => {
//   const authUser = useAuthStore((state) => state.authUser);
//   const [loading, setLoading] = useState(false);

//   const submitContact = async ({ title, description, category, onSuccess }) => {
//     // if (!authUser?.token) {
//     //   Alert.alert('Unauthorized', 'You must be logged in to submit a message.');
//     //   return;
//     // }

//     // // Client-side validation
//     // if (!title || title.trim().length === 0) {
//     //   Alert.alert('Validation Error', 'Title is required.');
//     //   return;
//     // }
//     // if (title.length > 100) {
//     //   Alert.alert('Validation Error', 'Title must not exceed 100 characters.');
//     //   return;
//     // }
//     // if (!description || description.trim().length === 0) {
//     //   Alert.alert('Validation Error', 'Description is required.');
//     //   return;
//     // }
//     // if (description.length > 2000) {
//     //   Alert.alert('Validation Error', 'Description must not exceed 2000 characters.');
//     //   return;
//     // }

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         'http://127.0.0.1:5000/api/contact', // Change to your actual backend URL
//         { title, description, category },
//         {
//           headers: {
//             Authorization: `Bearer ${authUser.token}`,
//           },
//         }
//       );

//       if (res.data.status === 'success') {
//         Alert.alert('Success', 'Message submitted successfully!');
//         onSuccess?.(); // Callback to close modal or reset form
//       } else {
//         Alert.alert('Error', res.data.message || 'Failed to submit contact message.');
//       }
//     } catch (err) {
//       console.error('Contact submission error:', err.response?.data || err.message);
//       Alert.alert('Error', err.response?.data?.message || 'Something went wrong. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, submitContact };
// };
// hooks/useContactUs.js
import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/AuthStore';
import Constants from 'expo-constants';
export const useContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const token = useAuthStore((state) => state.token);

  const createContactMessage = async ({ title, description, category }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${Constants.expoConfig.extra.API_BASE_URL}/contact/`,
        { title, description, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || 'Something went wrong. Try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Constants.expoConfig.extra.API_BASE_URL}/contact-us`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data.data.messages);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    contacts,
    createContactMessage,
    fetchAllMessages,
  };
};
