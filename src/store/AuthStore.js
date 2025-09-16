import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,        // will hold { …userData, token }
      loading: true,

      setAuthUser: (user) => 
        // expect `user` object to include your `token` field
        set({ authUser: user, loading: false }),

      clearAuth: () =>
        set({ authUser: null, loading: false }),

      setLoading: (loading) =>
        set({ loading }),

      // (optional) call once at app start if you need to do something special
      initializeAuth: () =>
        set({ loading: false }),
    }),
    {
      name: 'chat-user-storage',                 // your AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
      // only persist authUser (which itself includes token)
      partialize: (state) => ({ authUser: state.authUser }),
    }
  )
);
