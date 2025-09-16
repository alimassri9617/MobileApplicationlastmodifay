import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/AuthStore';
import Constants from 'expo-constants';
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthStore();

  const login = async (uniId, password) => {
    if (!uniId || !password) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniId, password }),
      });
      if(res.status !== 200) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Login failed');
        Toast.show({ type: 'error', text1: 'Login Failed', text2: errorData.error || 'Login failed' });
      }
      const data = await res.json();
      setAuthUser(data);
      console.log("Login returned token:", data.token);
      if (data.error) throw new Error(data.error);


      // put the whole user+token into your store
      setAuthUser(data);

      Toast.show({ type: 'success', text1: 'Login Successful', text2: 'Welcome back!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};




