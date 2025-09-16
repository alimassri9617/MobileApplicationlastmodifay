import { create } from 'zustand';
import { io } from 'socket.io-client';
import { socketConfig } from '../config';

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  
  connectSocket: (userId) => {
    if (!get().socket) {
      const socket = io(socketConfig.url, {
        query: { userId },
        timeout: socketConfig.timeout,
      });
      
      socket.on('getOnlineUsers', (users) => {
        set({ onlineUsers: users });
      });
      
      if (socketConfig.debug) {
        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
        });
        
        socket.on('disconnect', () => {
          console.log('Socket disconnected');
        });
      }
      
      set({ socket });
    }
  },
  
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, onlineUsers: [] });
    }
  },
  
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));

