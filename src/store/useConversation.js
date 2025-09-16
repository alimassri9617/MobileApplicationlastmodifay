import { create } from 'zustand';

export const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  
  messages: [],
  setMessages: (messages) => set({ messages }),
  
  // Add a new message to the current conversation
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  // Clear messages when switching conversations
  clearMessages: () => set({ messages: [] }),
}));

