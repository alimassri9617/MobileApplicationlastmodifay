import { useEffect } from 'react';
import { useSocketStore } from '../store/SocketStore';
import { useConversation } from '../store/useConversation';

export const useListenMessages = () => {
  const { socket } = useSocketStore();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setMessages([...messages, newMessage]);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, setMessages, messages]);
};

