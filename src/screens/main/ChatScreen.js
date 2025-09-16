// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { Avatar, IconButton, Divider } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import Toast from 'react-native-toast-message';
// import { useAuthStore } from '../../store/AuthStore';
// import { colors, spacing, typography } from '../../constants/theme';
// import { extractTime } from '../../utils/extractTime';

// export default function ChatScreen() {
//   const token = useAuthStore((state) => state.authUser?.token);
//   const userId = useAuthStore((state) => state.authUser?._id);

//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState('');
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch conversations
//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const res = await fetch(`${process.env.API_BASE_URL}/messages`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Failed to load conversations');

//         setConversations(data);
//       } catch (err) {
//         Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//       } finally {
//         setLoadingConversations(false);
//       }
//     };

//     fetchConversations();
//   }, [token]);

//   // Fetch messages when conversation selected
//   useEffect(() => {
//     if (!selectedConversation?._id) return;

//     const fetchMessages = async () => {
//       setLoadingMessages(true);
//       try {
//         const res = await fetch(
//           `${process.env.API_BASE_URL}/messages/${selectedConversation._id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Failed to load messages');

//         setMessages(data);
//       } catch (err) {
//         Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//       } finally {
//         setLoadingMessages(false);
//       }
//     };

//     fetchMessages();
//   }, [selectedConversation]);

//   const handleSendMessage = async () => {
//     if (!messageText.trim() || !selectedConversation) return;

//     setSendingMessage(true);
//     try {
//       const res = await fetch(
//         `${process.env.API_BASE_URL}/messages/send/${selectedConversation._id}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ message: messageText }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Failed to send message');

//       setMessages((prev) => [...prev, data]);
//       setMessageText('');
//     } catch (err) {
//       Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const filteredConversations = conversations.filter((user) =>
//     `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const renderConversationItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.conversationItem,
//         selectedConversation?._id === item._id && styles.selectedConversation,
//       ]}
//       onPress={() => setSelectedConversation(item)}
//     >
//       <Avatar.Image
//         size={50}
//         source={{ uri: item.profilePic || 'https://via.placeholder.com/50' }}
//       />
//       <View style={styles.conversationInfo}>
//         <Text style={styles.conversationName}>
//           {item.firstName} {item.lastName}
//         </Text>
//         <Text style={styles.conversationRole}>{item.role}</Text>
//       </View>
//       <View style={styles.conversationMeta}>
//         <Text style={styles.conversationTime}>12:30</Text>
//         {item.unreadCount > 0 && (
//           <View style={styles.unreadBadge}>
//             <Text style={styles.unreadCount}>{item.unreadCount}</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   const renderMessageItem = ({ item }) => {
//     const isMyMessage = item.senderId === userId;

//     return (
//       <View
//         style={[
//           styles.messageContainer,
//           isMyMessage ? styles.myMessage : styles.otherMessage,
//         ]}
//       >
//         <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
//           {item.message}
//         </Text>
//         <Text style={isMyMessage ? styles.myMessageTime : styles.otherMessageTime}>
//           {extractTime(item.createdAt)}
//         </Text>
//       </View>
//     );
//   };

//   if (!selectedConversation) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color={colors.gray} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search conversations..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//           />
//         </View>

//         {loadingConversations ? (
//           <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
//         ) : (
//           <FlatList
//             data={filteredConversations}
//             renderItem={renderConversationItem}
//             keyExtractor={(item) => item._id}
//             ItemSeparatorComponent={() => <Divider />}
//           />
//         )}
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       {/* Chat Header */}
//       <View style={styles.chatHeader}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => setSelectedConversation(null)}
//         >
//           <Ionicons name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Avatar.Image
//           size={40}
//           source={{
//             uri: selectedConversation.profilePic || 'https://via.placeholder.com/40',
//           }}
//         />
//         <View style={styles.chatHeaderInfo}>
//           <Text style={styles.chatHeaderName}>
//             {selectedConversation.firstName} {selectedConversation.lastName}
//           </Text>
//           <Text style={styles.chatHeaderStatus}>Offline</Text>
//         </View>
//       </View>

//       {/* Messages */}
//       {loadingMessages ? (
//         <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={messages}
//           renderItem={renderMessageItem}
//           keyExtractor={(item) => item._id}
//           style={styles.messagesList}
//           contentContainerStyle={styles.messagesContent}
//         />
//       )}

//       {/* Message Input */}
//       <View style={styles.messageInputContainer}>
//         <TextInput
//           style={styles.messageInput}
//           placeholder="Type a message..."
//           value={messageText}
//           onChangeText={setMessageText}
//           multiline
//           maxLength={500}
//         />
//         <IconButton
//           icon="send"
//           size={24}
//           iconColor={colors.primary}
//           onPress={handleSendMessage}
//           disabled={!messageText.trim() || sendingMessage}
//         />
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.white,
//     margin: spacing.md,
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.sm,
//     borderRadius: 25,
//     elevation: 2,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: spacing.sm,
//     ...typography.body1,
//   },
//   conversationItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: spacing.md,
//     backgroundColor: colors.white,
//   },
//   selectedConversation: {
//     backgroundColor: colors.lightGray,
//   },
//   conversationInfo: {
//     flex: 1,
//     marginLeft: spacing.md,
//   },
//   conversationName: {
//     ...typography.h6,
//     color: colors.text,
//   },
//   conversationRole: {
//     ...typography.body2,
//     color: colors.textSecondary,
//     marginTop: spacing.xs,
//   },
//   conversationMeta: {
//     alignItems: 'flex-end',
//   },
//   conversationTime: {
//     ...typography.caption,
//     color: colors.textSecondary,
//   },
//   unreadBadge: {
//     backgroundColor: colors.primary,
//     borderRadius: 10,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     marginTop: spacing.xs,
//     minWidth: 20,
//     alignItems: 'center',
//   },
//   unreadCount: {
//     ...typography.caption,
//     color: colors.white,
//     fontWeight: 'bold',
//   },
//   chatHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: spacing.md,
//     backgroundColor: colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   backButton: {
//     marginRight: spacing.md,
//   },
//   chatHeaderInfo: {
//     marginLeft: spacing.md,
//     flex: 1,
//   },
//   chatHeaderName: {
//     ...typography.h6,
//     color: colors.text,
//   },
//   chatHeaderStatus: {
//     ...typography.caption,
//     color: colors.error,
//   },
//   messagesList: {
//     flex: 1,
//   },
//   messagesContent: {
//     padding: spacing.md,
//   },
//   messageContainer: {
//     maxWidth: '80%',
//     marginVertical: spacing.xs,
//     padding: spacing.md,
//     borderRadius: 16,
//   },
//   myMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: colors.primary,
//   },
//   otherMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: colors.white,
//   },
//   myMessageText: {
//     ...typography.body1,
//     color: colors.white,
//   },
//   otherMessageText: {
//     ...typography.body1,
//     color: colors.text,
//   },
//   myMessageTime: {
//     ...typography.caption,
//     color: 'rgba(255, 255, 255, 0.7)',
//     marginTop: spacing.xs,
//   },
//   otherMessageTime: {
//     ...typography.caption,
//     color: colors.textSecondary,
//     marginTop: spacing.xs,
//   },
//   messageInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     padding: spacing.md,
//     backgroundColor: colors.white,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   messageInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 20,
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.sm,
//     marginRight: spacing.sm,
//     maxHeight: 100,
//     ...typography.body1,
//   },
// });


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { Avatar, IconButton, Divider } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import Toast from 'react-native-toast-message';
// import { useAuthStore } from '../../store/AuthStore';
// import { colors, spacing, typography } from '../../constants/theme';
// import { extractTime } from '../../utils/extractTime';
// import { io } from 'socket.io-client';
// import axios from 'axios';

// const SOCKET_URL = 'http://192.168.1.105:6666';

// export default function ChatScreen() {
//   const token = useAuthStore((state) => state.authUser?.token);
//   const userId = useAuthStore((state) => state.authUser?._id);

//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState('');
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const socketRef = useRef(null);




//   useEffect(() => {
//     if (!token || !userId) return;

//     const socket = io(SOCKET_URL, {
//       query: { userId },
//       transports: ['websocket'],
//     });

//     socketRef.current = socket;

//     socket.on('connect', () => console.log('✅ Socket connected:', socket.id));
//     socket.on('getOnlineUsers', (users) => console.log('🟢 Online users:', users));

//     socket.on('newMessage', (newMsg) => {
//       if (newMsg.senderId === selectedConversation?._id) {
//         setMessages((prev) => [...prev, newMsg]);
//       }
//     });

//     socket.on('updateUnreadCount', ({ userId: senderId, unreadCount }) => {
//       setConversations((prev) =>
//         prev.map((conv) =>
//           conv._id === senderId ? { ...conv, unreadCount } : conv
//         )
//       );
//     });

//     return () => {
//       socket.disconnect();
//       console.log('❌ Socket disconnected');
//     };
//   }, [token, userId, selectedConversation]);

//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const res = await axios.get(`${process.env.API_BASE_URL}/messages`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setConversations(res.data);
//       } catch (err) {
//         Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//       } finally {
//         setLoadingConversations(false);
//       }
//     };

//     fetchConversations();
//   }, [token]);

//   useEffect(() => {
//     if (!selectedConversation?._id) return;

//     const fetchMessages = async () => {
//       setLoadingMessages(true);
//       try {
//         const res = await axios.get(
//           `${process.env.API_BASE_URL}/messages/${selectedConversation._id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setMessages(res.data);
//       } catch (err) {
//         Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//       } finally {
//         setLoadingMessages(false);
//       }
//     };

//     fetchMessages();
//   }, [selectedConversation]);
// useEffect(() => {
//   const markAsRead = async () => {
//     if (!selectedConversation || !selectedConversation._id || !token) return;

//     try {
//       await axios.post(
//         `${process.env.API_BASE_URL}/messages/read/${selectedConversation._id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Set unreadCount to 0 in local state
//       setConversations((prev) =>
//         prev.map((conv) =>
//           conv._id === selectedConversation._id ? { ...conv, unreadCount: 0 } : conv
//         )
//       );
//     } catch (err) {
//       console.error('Error marking messages as read:', err);
//     }
//   };

//   markAsRead();
// }, [selectedConversation, token]);

//   const handleSendMessage = async () => {
//     if (!messageText.trim() || !selectedConversation) return;
//     setSendingMessage(true);

//     try {
//       const res = await axios.post(
//         `${process.env.API_BASE_URL}/messages/send/${selectedConversation._id}`,
//         { message: messageText },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setMessages((prev) => [...prev, res.data]);
//       setMessageText('');

//       if (socketRef.current) {
//         socketRef.current.emit('sendMessage', {
//           token,
//           receiverId: selectedConversation._id,
//           message: messageText,
//         });
//       }
//     } catch (err) {
//       Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const filteredConversations = conversations.filter((user) =>
//     `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const renderConversationItem = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.conversationItem, selectedConversation?._id === item._id && styles.selectedConversation]}
//       onPress={() => setSelectedConversation(item)}
//     >
//       <Avatar.Image size={50} source={{ uri: item.profilePic || 'https://via.placeholder.com/50' }} />
//       <View style={styles.conversationInfo}>
//         <Text style={styles.conversationName}>{item.firstName} {item.lastName}</Text>
//         <Text style={styles.conversationRole}>{item.role}</Text>
//       </View>
//       <View style={styles.conversationMeta}>
//         <Text style={styles.conversationTime}>12:30</Text>
//         {item.unreadCount > 0 && (
//           <View style={styles.unreadBadge}>
//             <Text style={styles.unreadCount}>{item.unreadCount}</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   const renderMessageItem = ({ item }) => {
//     const isMyMessage = item.senderId === userId;
//     return (
//       <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
//         <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>{item.message}</Text>
//         <Text style={isMyMessage ? styles.myMessageTime : styles.otherMessageTime}>{extractTime(item.createdAt)}</Text>
//       </View>
//     );
//   };

//   if (!selectedConversation) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color={colors.gray} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search conversations..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//           />
//         </View>
//         {loadingConversations ? (
//           <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
//         ) : (
//           <FlatList
//             data={filteredConversations}
//             renderItem={renderConversationItem}
//             keyExtractor={(item) => item._id}
//             ItemSeparatorComponent={() => <Divider />}
//           />
//         )}
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={styles.chatHeader}>
//         <TouchableOpacity style={styles.backButton} onPress={() => setSelectedConversation(null)}>
//           <Ionicons name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Avatar.Image size={40} source={{ uri: selectedConversation.profilePic || 'https://via.placeholder.com/40' }} />
//         <View style={styles.chatHeaderInfo}>
//           <Text style={styles.chatHeaderName}>{selectedConversation.firstName} {selectedConversation.lastName}</Text>
//           <Text style={styles.chatHeaderStatus}>Offline</Text>
//         </View>
//       </View>

//       {loadingMessages ? (
//         <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={messages}
//           renderItem={renderMessageItem}
//           keyExtractor={(item) => item._id}
//           style={styles.messagesList}
//           contentContainerStyle={styles.messagesContent}
//         />
//       )}

//       <View style={styles.messageInputContainer}>
//         <TextInput
//           style={styles.messageInput}
//           placeholder="Type a message..."
//           value={messageText}
//           onChangeText={setMessageText}
//           multiline
//           maxLength={500}
//         />
//         <IconButton
//           icon="send"
//           size={24}
//           iconColor={colors.primary}
//           onPress={handleSendMessage}
//           disabled={!messageText.trim() || sendingMessage}
//         />
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// ===== screens/ChatScreen.js =====
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View, Text, StyleSheet, FlatList, TextInput,
//   TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
// } from 'react-native';
// import { Avatar, IconButton, Divider } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import Toast from 'react-native-toast-message';
// import { useAuthStore } from '../../store/AuthStore';
// import { colors, spacing, typography } from '../../constants/theme';
// import { extractTime } from '../../utils/extractTime';
// import { io } from 'socket.io-client';
// import axios from 'axios';

// const SOCKET_URL = 'http://192.168.1.105:6666';

// export default function ChatScreen() {
//   const token = useAuthStore((state) => state.authUser?.token);
//   const userId = useAuthStore((state) => state.authUser?._id);

//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState('');
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   const socketRef = useRef(null);

//   useEffect(() => {
//     if (!token || !userId) return;

//     const socket = io(SOCKET_URL, {
//       query: { userId },
//       transports: ['websocket'],
//     });

//     socketRef.current = socket;

//     socket.on('connect', () => console.log('✅ Socket connected:', socket.id));
//     socket.on('getOnlineUsers', (users) => setOnlineUsers(users));
//     socket.on('newMessage', (newMsg) => {
//       if (newMsg.senderId === selectedConversation?._id) {
//         setMessages((prev) => [...prev, newMsg]);
//       }
//     });
//     socket.on('updateUnreadCount', ({ userId: senderId, unreadCount }) => {
//       setConversations((prev) =>
//         prev.map((conv) =>
//           conv._id === senderId ? { ...conv, unreadCount } : conv
//         )
//       );
//     });

//     return () => {
//       socket.disconnect();
//       console.log('❌ Socket disconnected');
//     };
//   }, [token, userId, selectedConversation]);

//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const res = await axios.get(`${process.env.API_BASE_URL}/messages`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setConversations(res.data);
//       } catch (err) {
//         Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//       } finally {
//         setLoadingConversations(false);
//       }
//     };

//     fetchConversations();
//   }, [token]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedConversation?._id) return;
//       setLoadingMessages(true);
//       try {
//         const res = await axios.get(
//           `${process.env.API_BASE_URL}/messages/${selectedConversation._id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setMessages(res.data);
//       } catch (err) {
//         Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//       } finally {
//         setLoadingMessages(false);
//       }
//     };

//     fetchMessages();
//   }, [selectedConversation]);

//   useEffect(() => {
//     const markAsRead = async () => {
//       if (!selectedConversation || !selectedConversation._id || !token) return;
//       try {
//         await axios.post(
//           `${process.env.API_BASE_URL}/messages/read/${selectedConversation._id}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setConversations((prev) =>
//           prev.map((conv) =>
//             conv._id === selectedConversation._id ? { ...conv, unreadCount: 0 } : conv
//           )
//         );
//       } catch (err) {
//         console.error('Error marking messages as read:', err);
//       }
//     };

//     markAsRead();
//   }, [selectedConversation, token]);

//   const handleSendMessage = async () => {
//     if (!messageText.trim() || !selectedConversation) return;
//     setSendingMessage(true);
//     try {
//       const res = await axios.post(
//         `${process.env.API_BASE_URL}/messages/send/${selectedConversation._id}`,
//         { message: messageText },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessages((prev) => [...prev, res.data]);
//       setMessageText('');
//       socketRef.current?.emit('sendMessage', {
//         token,
//         receiverId: selectedConversation._id,
//         message: messageText,
//       });
//     } catch (err) {
//       Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const isUserOnline = (id) => onlineUsers.includes(id);

//   const filteredConversations = conversations.filter((user) =>
//     `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const renderConversationItem = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.conversationItem, selectedConversation?._id === item._id && styles.selectedConversation]}
//       onPress={() => setSelectedConversation(item)}
//     >
//       <Avatar.Image size={50} source={{ uri: item.profilePic || 'https://via.placeholder.com/50' }} />
//       <View style={styles.conversationInfo}>
//         <Text style={styles.conversationName}>{item.firstName} {item.lastName}</Text>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isUserOnline(item._id) ? 'green' : 'gray', marginRight: 6 }} />
//           <Text style={styles.conversationRole}>{item.role}</Text>
//         </View>
//       </View>
//       <View style={styles.conversationMeta}>
//         <Text style={styles.conversationTime}>12:30</Text>
//         {item.unreadCount > 0 && (
//           <View style={styles.unreadBadge}>
//             <Text style={styles.unreadCount}>{item.unreadCount}</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   const renderMessageItem = ({ item }) => {
//     const isMyMessage = item.senderId === userId;
//     return (
//       <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
//         <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>{item.message}</Text>
//         <Text style={isMyMessage ? styles.myMessageTime : styles.otherMessageTime}>{extractTime(item.createdAt)}</Text>
//       </View>
//     );
//   };

//   if (!selectedConversation) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color={colors.gray} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search conversations..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//           />
//         </View>
//         {loadingConversations ? (
//           <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
//         ) : (
//           <FlatList
//             data={filteredConversations}
//             renderItem={renderConversationItem}
//             keyExtractor={(item) => item._id}
//             ItemSeparatorComponent={() => <Divider />}
//           />
//         )}
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <View style={styles.chatHeader}>
//         <TouchableOpacity style={styles.backButton} onPress={() => setSelectedConversation(null)}>
//           <Ionicons name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Avatar.Image size={40} source={{ uri: selectedConversation.profilePic || 'https://via.placeholder.com/40' }} />
//         <View style={styles.chatHeaderInfo}>
//           <Text style={styles.chatHeaderName}>{selectedConversation.firstName} {selectedConversation.lastName}</Text>
//           <Text style={[styles.chatHeaderStatus, { color: isUserOnline(selectedConversation._id) ? 'green' : colors.error }]}> {isUserOnline(selectedConversation._id) ? 'Online' : 'Offline'} </Text>
//         </View>
//       </View>

//       {loadingMessages ? (
//         <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={messages}
//           renderItem={renderMessageItem}
//           keyExtractor={(item) => item._id}
//           style={styles.messagesList}
//           contentContainerStyle={styles.messagesContent}
//         />
//       )}

//       <View style={styles.messageInputContainer}>
//         <TextInput
//           style={styles.messageInput}
//           placeholder="Type a message..."
//           value={messageText}
//           onChangeText={setMessageText}
//           multiline
//           maxLength={500}
//         />
//         <IconButton
//           icon="send"
//           size={24}
//           iconColor={colors.primary}
//           onPress={handleSendMessage}
//           disabled={!messageText.trim() || sendingMessage}
//         />
//       </View>
//     </KeyboardAvoidingView>
//   );
// }



//-----------------------------------
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View, Text, StyleSheet, FlatList, TextInput,
//   TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
// } from 'react-native';
// import { Avatar, IconButton, Divider } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import Toast from 'react-native-toast-message';
// import { useAuthStore } from '../../store/AuthStore';
// import { colors, spacing, typography } from '../../constants/theme';
// import { extractTime } from '../../utils/extractTime';
// import { registerForPushNotificationsAsync } from '../../hooks/usenotif'; // Add this if using push
// import { io } from 'socket.io-client';
// import axios from 'axios';

// const SOCKET_URL = 'http://192.168.1.105:6666'; // Update with your backend IP

// export default function ChatScreen() {
//   const token = useAuthStore((state) => state.authUser?.token);
//   const userId = useAuthStore((state) => state.authUser?._id);

//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState('');
//   const [loadingConversations, setLoadingConversations] = useState(true);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   const socketRef = useRef(null);

//   useEffect(() => {
//     if (!token || !userId) return;

//     const socket = io(SOCKET_URL, {
//       query: { userId },
//       transports: ['websocket'],
//     });

//     socketRef.current = socket;

//     socket.on('connect', () => console.log('✅ Socket connected:', socket.id));
//     socket.on('getOnlineUsers', (users) => setOnlineUsers(users));
//     socket.on('newMessage', (newMsg) => {
//       if (newMsg.senderId === selectedConversation?._id) {
//         setMessages((prev) => [...prev, newMsg]);
//       }
//     });
//     socket.on('updateUnreadCount', ({ userId: senderId, unreadCount }) => {
//       setConversations((prev) =>
//         prev.map((conv) =>
//           conv._id === senderId ? { ...conv, unreadCount } : conv
//         )
//       );
//     });

//     return () => {
//       socket.disconnect();
//       console.log('❌ Socket disconnected');
//     };
//   }, [token, userId, selectedConversation]);

//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const res = await axios.get(`${process.env.API_BASE_URL}/messages`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setConversations(res.data);
//       } catch (err) {
//         Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//       } finally {
//         setLoadingConversations(false);
//       }
//     };

//     fetchConversations();
//   }, [token]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedConversation?._id) return;
//       setLoadingMessages(true);
//       try {
//         const res = await axios.get(
//           `${process.env.API_BASE_URL}/messages/${selectedConversation._id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setMessages(res.data);
//       } catch (err) {
//         Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//       } finally {
//         setLoadingMessages(false);
//       }
//     };

//     fetchMessages();
//   }, [selectedConversation]);

//   useEffect(() => {
//     const markAsRead = async () => {
//       if (!selectedConversation || !selectedConversation._id || !token) return;
//       try {
//         await axios.post(
//           `${process.env.API_BASE_URL}/messages/read/${selectedConversation._id}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setConversations((prev) =>
//           prev.map((conv) =>
//             conv._id === selectedConversation._id ? { ...conv, unreadCount: 0 } : conv
//           )
//         );
//       } catch (err) {
//         console.error('Error marking messages as read:', err);
//       }
//     };

//     markAsRead();
//   }, [selectedConversation, token]);

//   const handleSendMessage = async () => {
//     if (!messageText.trim() || !selectedConversation) return;
//     setSendingMessage(true);
//     try {
//       const res = await axios.post(
//         `${process.env.API_BASE_URL}/messages/send/${selectedConversation._id}`,
//         { message: messageText },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessages((prev) => [...prev, res.data]);
//       setMessageText('');
//       socketRef.current?.emit('sendMessage', {
//         token,
//         receiverId: selectedConversation._id,
//         message: messageText,
//       });
//     } catch (err) {
//       Toast.show({ type: 'error', text1: 'Error', text2: err.message });
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const isUserOnline = (id) => onlineUsers.includes(id);

//   const filteredConversations = conversations.filter((user) =>
//     `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const renderConversationItem = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.conversationItem, selectedConversation?._id === item._id && styles.selectedConversation]}
//       onPress={() => setSelectedConversation(item)}
//     >
//       <Avatar.Image size={50} source={{ uri: item.profilePic || 'https://via.placeholder.com/50' }} />
//       <View style={styles.conversationInfo}>
//         <Text style={styles.conversationName}>{item.firstName} {item.lastName}</Text>
//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isUserOnline(item._id) ? 'green' : 'gray', marginRight: 6 }} />
//           <Text style={styles.conversationRole}>{item.role}</Text>
//         </View>
//       </View>
//       <View style={styles.conversationMeta}>
//         <Text style={styles.conversationTime}>12:30</Text>
//         {item.unreadCount > 0 && (
//           <View style={styles.unreadBadge}>
//             <Text style={styles.unreadCount}>{item.unreadCount}</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   const renderMessageItem = ({ item }) => {
//     const isMyMessage = item.senderId === userId;
//     return (
//       <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
//         <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>{item.message}</Text>
//         <Text style={isMyMessage ? styles.myMessageTime : styles.otherMessageTime}>{extractTime(item.createdAt)}</Text>
//       </View>
//     );
//   };

//   if (!selectedConversation) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color={colors.gray} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search conversations..."
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//           />
//         </View>
//         {loadingConversations ? (
//           <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
//         ) : (
//           <FlatList
//             data={filteredConversations}
//             renderItem={renderConversationItem}
//             keyExtractor={(item) => item._id}
//             ItemSeparatorComponent={() => <Divider />}
//           />
//         )}
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <View style={styles.chatHeader}>
//         <TouchableOpacity style={styles.backButton} onPress={() => setSelectedConversation(null)}>
//           <Ionicons name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Avatar.Image size={40} source={{ uri: selectedConversation.profilePic || 'https://via.placeholder.com/40' }} />
//         <View style={styles.chatHeaderInfo}>
//           <Text style={styles.chatHeaderName}>{selectedConversation.firstName} {selectedConversation.lastName}</Text>
//           <Text style={[styles.chatHeaderStatus, { color: isUserOnline(selectedConversation._id) ? 'green' : colors.error }]}>
//             {isUserOnline(selectedConversation._id) ? 'Online' : 'Offline'}
//           </Text>
//         </View>
//       </View>

//       {loadingMessages ? (
//         <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={messages}
//           renderItem={renderMessageItem}
//           keyExtractor={(item) => item._id}
//           style={styles.messagesList}
//           contentContainerStyle={styles.messagesContent}
//         />
//       )}

//       <View style={styles.messageInputContainer}>
//         <TextInput
//           style={styles.messageInput}
//           placeholder="Type a message..."
//           value={messageText}
//           onChangeText={setMessageText}
//           multiline
//           maxLength={500}
//         />
//         <IconButton
//           icon="send"
//           size={24}
//           iconColor={colors.primary}
//           onPress={handleSendMessage}
//           disabled={!messageText.trim() || sendingMessage}
//         />
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Avatar, IconButton, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/AuthStore';
import { colors, spacing, typography } from '../../constants/theme';
import { extractTime } from '../../utils/extractTime';
import { usePushNotifications } from '../../hooks/usenotif'; // Your push notif registration hook
import { io } from 'socket.io-client';
import axios from 'axios';
import Constants from 'expo-constants';
import { ScrollView } from 'react-native-gesture-handler';
const SOCKET_URL = Constants.expoConfig.extra.SOCKET_URL+""; // Your backend IP




export default function ChatScreen() {
  const { expoPushToken, notification } = usePushNotifications();
// const data = notification ? JSON.stringify(notification, null, 2) : "No notification yet";

console.log("test divice token", expoPushToken?.data);
  const token = useAuthStore((state) => state.authUser?.token);
  const userId = useAuthStore((state) => state.authUser?._id);


useEffect(() => {
    if (expoPushToken?.data) {
      axios.post(`${Constants.expoConfig.extra.API_BASE_URL}/messages/token`, {
        token: expoPushToken?.data,
        uniid: useAuthStore.getState().authUser?._id,
      })
        .then((response) => {
          console.log('Expo push token registered successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error registering Expo push token:', error.message);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.message || 'Failed to register push token',
          });
        });
    }
  }, [expoPushToken]);


  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !userId) return;

    const socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => console.log('✅ Socket connected:', socket.id));
    socket.on('getOnlineUsers', (users) => setOnlineUsers(users));
    socket.on('newMessage', (newMsg) => {
      // Append new messages only if from selected conversation partner
      if (newMsg.senderId === selectedConversation?._id || newMsg.receiverId === selectedConversation?._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });
    socket.on('updateUnreadCount', ({ userId: senderId, unreadCount }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === senderId ? { ...conv, unreadCount } : conv
        )
      );
    });

    return () => {
      socket.disconnect();
      console.log('❌ Socket disconnected');
    };
  }, [token, userId, selectedConversation]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${Constants.expoConfig.extra.API_BASE_URL}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data);
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Error', text2: err.message });
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [token]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?._id) return;
      setLoadingMessages(true);
      try {
        const res = await axios.get(
          `${Constants.expoConfig.extra.API_BASE_URL}/messages/${selectedConversation._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Error', text2: err.message });
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  useEffect(() => {
    const markAsRead = async () => {
      if (!selectedConversation || !selectedConversation._id || !token) return;
      try {
        await axios.post(
          `${Constants.expoConfig.extra.API_BASE_URL}/messages/read/${selectedConversation._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === selectedConversation._id ? { ...conv, unreadCount: 0 } : conv
          )
        );
      } catch (err) {
        console.log('Error marking messages as read:', err);
      }
    };

    markAsRead();
  }, [selectedConversation, token]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;
    setSendingMessage(true);
    try {
      const res = await axios.post(
        `${Constants.expoConfig.extra.API_BASE_URL}/messages/send/${selectedConversation._id}`,
        { message: messageText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      setMessageText('');
      socketRef.current?.emit('sendMessage', {
        token,
        receiverId: selectedConversation._id,
        message: messageText,
      });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    } finally {
      setSendingMessage(false);
    }
  };

  const isUserOnline = (id) => onlineUsers.includes(id);

  const filteredConversations = conversations.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.conversationItem, selectedConversation?._id === item._id && styles.selectedConversation]}
      onPress={() => setSelectedConversation(item)}
    >
 {item.profilePic &&
   (item.profilePic.substring(0, 33) === 'https://ui-avatars.com/api/?name=' ? (
     <Avatar.Text
       size={64}
       label={`${item.firstName.charAt(0)}${item.lastName.charAt(0)}`}
       style={{ backgroundColor: colors.primary }}
     />
   ) : (
     <Avatar.Image
       size={64}
       source={{ uri: item.profilePic }}
     />
   ))
 }
      <View style={styles.conversationInfo}>
        <Text style={styles.conversationName}>{item.firstName} {item.lastName}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: isUserOnline(item._id) ? 'green' : 'gray',
            marginRight: 6,
          }} />
          <Text style={styles.conversationRole}>{item.role}</Text>
        </View>
      </View>
      <View style={styles.conversationMeta}>
        <Text style={styles.conversationTime}>{item.createdAt}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }) => {
    const isMyMessage = item.senderId === userId;
    return (
      <ScrollView style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>{item.message}</Text>
        <Text style={isMyMessage ? styles.myMessageTime : styles.otherMessageTime}>{extractTime(item.createdAt)}</Text>
      </ScrollView>
    );
  };

  if (!selectedConversation) {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        {loadingConversations ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredConversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <Divider />}
          />
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedConversation(null)}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        {/* <Avatar.Image size={40} source={{ uri: selectedConversation.profilePic || 'https://via.placeholder.com/40' }} /> */}

          {selectedConversation.profilePic &&
            (selectedConversation.profilePic.substring(0, 33) === 'https://ui-avatars.com/api/?name=' ? (
              <Avatar.Text
                size={64}
                label={`${selectedConversation.firstName.charAt(0)}${selectedConversation.lastName.charAt(0)}`}
                style={{ backgroundColor: colors.primary }}
              />
            ) : (
              <Avatar.Image
                size={64}
                source={{ uri: selectedConversation.profilePic }}
              />
            ))
          }
        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatHeaderName}>{selectedConversation.firstName} {selectedConversation.lastName}</Text>
          <Text style={[styles.chatHeaderStatus, { color: isUserOnline(selectedConversation._id) ? 'green' : colors.error }]}>
            {isUserOnline(selectedConversation._id) ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {loadingMessages ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item._id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
        />
      )}

      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
        />
        <IconButton
          icon="send"
          size={24}
          iconColor={colors.primary}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || sendingMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 25,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  selectedConversation: {
    backgroundColor: colors.lightGray,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  conversationName: {
    ...typography.h6,
    color: colors.text,
  },
  conversationRole: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  conversationTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: spacing.xs,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCount: {
    ...typography.caption,
    color: colors.white,
    fontWeight: 'bold',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
  },
  chatHeaderInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  chatHeaderName: {
    ...typography.h6,
    color: colors.text,
  },
  chatHeaderStatus: {
    ...typography.caption,
    color: colors.error,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: spacing.xs,
    padding: spacing.md,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
  },
  myMessageText: {
    ...typography.body1,
    color: colors.white,
  },
  otherMessageText: {
    ...typography.body1,
    color: colors.text,
  },
  myMessageTime: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing.xs,
  },
  otherMessageTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    maxHeight: 100,
    ...typography.body1,
  },
});
