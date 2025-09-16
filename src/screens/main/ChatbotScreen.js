// // import React, { useState, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   FlatList,
// //   TextInput,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ScrollView,
// //   TouchableOpacity,
// // } from 'react-native';
// // import { IconButton, Avatar } from 'react-native-paper';

// // // ✅ Antonine campus data & staff info
// // const buildingInfo = {
// //   campus: "Antonine University - Zahle",
// //   floors: {
// //     ground: [
// //       { name: "Secretary's office", location: "left of main entrance" },
// //       { name: "Church", location: "right of main entrance" },
// //       { name: "Principal's office", location: "behind the staircase" },
// //       { name: "Admission office", location: "next to Principal's office" },
// //       { name: "Theatre", location: "next to the cafeteria" },
// //       { name: "Cafeteria", location: "next to the Theatre" },
// //     ],
// //     first: [
// //       { name: "Robotics Lab", room: "100" },
// //       { name: "Amphitheatre", room: "104" },
// //       { name: "Office of Student Affairs", room: "110" },
// //       { name: "Office of Management", room: "106" },
// //     ],
// //     second: [
// //       { name: "IT department", room: "203" },
// //       { name: "Library", room: "204" },
// //       { name: "Mirna Achkouty's office", room: "207" },
// //       { name: "Learning Lab", room: "210" },
// //       { name: "Cuisine", room: "200" },
// //       { name: "Cisco Lab", room: "201" },
// //     ],
// //     third: [
// //       { name: "Electronics Lab", room: "304" },
// //       { name: "School of Music", room: "303" },
// //       { name: "Multimedia Lab", room: "301" },
// //       { name: "Telecom Lab", room: "300" },
// //     ],
// //   },
// //   staff: [
// //     {
// //       name: "Anthony Tannoury",
// //       credentials: "PhD",
// //       title: "Dean’s Delegate",
// //       phone: "+961 8 902020",
// //       email: "anthony.tannoury@ua.edu.lb"
// //     },
// //     {
// //       name: "Michel Tannoury",
// //       title: "Senior Lecturer",
// //       phone: "+961 8 902020 - 30 - 40 ext. 4111",
// //       email: "michel.tannoury@ua.edu.lb"
// //     },
// //     {
// //       name: "Mirna Achkouty",
// //       title: "Administrative Assistant",
// //       phone: "+961 8 902020",
// //       email: "mirna.achkouty@ua.edu.lb"
// //     },
// //     {
// //       name: "Faculty of Engineering and Technology",
// //       title: "",
// //       phone: "+961 8 902020",
// //       email: "assistant.foe@ua.edu.lb"
// //     },
// //     {
// //       name: "Chady Abou Jaoude",
// //       credentials: "PhD",
// //       title: "Associate Professor, Dean",
// //       phone: "+961 5 927000 ext. 2100",
// //       email: "chady.aboujaoude@ua.edu.lb"
// //     },
// //     {
// //       name: "Kabalan Chaccour",
// //       credentials: "PhD",
// //       title: "Head of the Department of Computer and Communications Engineering",
// //       phone: "+961 5 927000 ext. 2122",
// //       email: "kabalan.chaccour@ua.edu.lb"
// //     },
// //     {
// //       name: "Charbel El Gemayel",
// //       credentials: "PhD",
// //       title: "Head of the Department of Technology in Computer Science",
// //       phone: "N/A",
// //       email: "charbel.gemayel@ua.edu.lb"
// //     }
// //   ]
// // };

// // const staffDirectory = buildingInfo.staff.map(({ name, credentials, title, phone, email }) => {
// //   const cred = credentials ? `, ${credentials}` : "";
// //   return `${name}${cred} is the ${title}. You can reach them at ${phone}${email ? ` or email at ${email}` : ""}.`;
// // }).join("\n");

// // const campusDescription = `Antonine Zahle Campus Overview:
// // [...]
// // Staff Directory:
// // ${staffDirectory}`;

// // const predefinedQuestions = [
// //   "Where is the Robotics Lab?",
// //   "How to contact the Dean?",
// //   "Where is the Library?",
// //   "Where is the Cafeteria?",
// //   "Who is Mirna Achkouty?",
// // ];

// // export default function ChatbotScreen() {
// //   const [messages, setMessages] = useState([
// //     {
// //       id: '1',
// //       text: "Hello! I'm your AI assistant for Antonine Zahle Campus. How can I help you today?",
// //       isBot: true,
// //       timestamp: new Date(),
// //     },
// //   ]);
// //   const [inputText, setInputText] = useState('');
// //   const [isTyping, setIsTyping] = useState(false);
// //   const flatListRef = useRef(null);

// //   const sendMessage = async (customQuestion) => {
// //     const question = customQuestion || inputText.trim();
// //     if (!question) return;

// //     const userMessage = {
// //       id: Date.now().toString(),
// //       text: question,
// //       isBot: false,
// //       timestamp: new Date(),
// //     };

// //     setMessages(prev => [...prev, userMessage]);
// //     setInputText('');
// //     setIsTyping(true);

// //     const prompt = `
// // You are a helpful assistant for Antonine Zahle Campus. Only answer using the information below.

// // Campus:
// // ${campusDescription}

// // Question: ${question}
// // `;

// //     try {
// //       const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': 'Bearer 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',
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({
// //           model: 'deepseek/deepseek-r1-0528:free',
// //           messages: [
// //             { role: 'system', content: 'You are a helpful assistant that provides information about Antonine Zahle Campus.' },
// //             { role: 'user', content: prompt }
// //           ],
// //           temperature: 0.2,
// //           max_tokens: 256
// //         }),
// //       });

// //       const data = await response.json();
// //       const botMessage = {
// //         id: (Date.now() + 1).toString(),
// //         text: data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't understand that.",
// //         isBot: true,
// //         timestamp: new Date(),
// //       };

// //       setMessages(prev => [...prev, botMessage]);
// //     } catch (err) {
// //       console.error("Assistant error:", err);
// //       setMessages(prev => [...prev, {
// //         id: (Date.now() + 1).toString(),
// //         text: "Sorry, I couldn't reach the assistant right now.",
// //         isBot: true,
// //         timestamp: new Date(),
// //       }]);
// //     }

// //     setIsTyping(false);
// //   };

// //   const renderMessage = ({ item }) => (
// //     <View style={[
// //       styles.messageContainer,
// //       { justifyContent: item.isBot ? 'flex-start' : 'flex-end' }
// //     ]}>
// //       {item.isBot && <Avatar.Icon size={28} icon="robot" style={{ marginRight: 6 }} />}
// //       <View style={[
// //         styles.messageBubble,
// //         { backgroundColor: item.isBot ? '#f1f1f1' : '#007AFF' }
// //       ]}>
// //         <Text style={{ color: item.isBot ? '#000' : '#fff' }}>{item.text}</Text>
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
// //       <FlatList
// //         ref={flatListRef}
// //         data={messages}
// //         keyExtractor={item => item.id}
// //         renderItem={renderMessage}
// //         contentContainerStyle={styles.chatContainer}
// //       />

// //       {/* 🔹 Predefined Questions */}
// //       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestions}>
// //         {predefinedQuestions.map((question, index) => (
// //           <TouchableOpacity
// //             key={index}
// //             style={styles.questionButton}
// //             onPress={() => sendMessage(question)}
// //           >
// //             <Text style={styles.questionText}>{question}</Text>
// //           </TouchableOpacity>
// //         ))}
// //       </ScrollView>

// //       {/* 🔹 Text Input */}
// //       <View style={styles.inputArea}>
// //         <TextInput
// //           style={styles.textInput}
// //           placeholder="Ask a question..."
// //           value={inputText}
// //           onChangeText={setInputText}
// //         />
// //         <IconButton icon="send" onPress={() => sendMessage()} disabled={isTyping || !inputText.trim()} />
// //       </View>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   chatContainer: {
// //     padding: 12,
// //     paddingBottom: 8,
// //   },
// //   messageContainer: {
// //     flexDirection: 'row',
// //     marginVertical: 6,
// //     alignItems: 'flex-end',
// //   },
// //   messageBubble: {
// //     padding: 10,
// //     borderRadius: 16,
// //     maxWidth: '75%',
// //   },
// //   quickQuestions: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //     backgroundColor: '#f9f9f9',
// //     borderTopWidth: 1,
// //     borderColor: '#ddd',
// //   },
// //   questionButton: {
// //     backgroundColor: '#eee',
// //     paddingHorizontal: 14,
// //     paddingVertical: 8,
// //     borderRadius: 20,
// //     marginRight: 8,
// //   },
// //   questionText: {
// //     color: '#333',
// //     fontSize: 14,
// //   },
// //   inputArea: {
// //     flexDirection: 'row',
// //     padding: 8,
// //     alignItems: 'center',
// //     backgroundColor: '#fff',
// //     borderTopWidth: 1,
// //     borderColor: '#ccc',
// //   },
// //   textInput: {
// //     flex: 1,
// //     borderColor: '#ccc',
// //     borderWidth: 1,
// //     borderRadius: 20,
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     marginRight: 6,
// //   },
// // });


// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import { IconButton, Avatar } from 'react-native-paper';

// // Γ£à Antonine campus data & staff info
// const buildingInfo = {
//   campus: "Antonine University - Zahle",
//   floors: {
//     ground: [
//       { name: "Secretary's office", location: "left of main entrance" },
//       { name: "Church", location: "right of main entrance" },
//       { name: "Principal's office", location: "behind the staircase" },
//       { name: "Admission office", location: "next to Principal's office" },
//       { name: "Theatre", location: "next to the cafeteria" },
//       { name: "Cafeteria", location: "next to the Theatre" },
//     ],
//     first: [
//       { name: "Robotics Lab", room: "100" },
//       { name: "Amphitheatre", room: "104" },
//       { name: "Office of Student Affairs", room: "110" },
//       { name: "Office of Management", room: "106" },
//     ],
//     second: [
//       { name: "IT department", room: "203" },
//       { name: "Library", room: "204" },
//       { name: "Mirna Achkouty's office", room: "207" },
//       { name: "Learning Lab", room: "210" },
//       { name: "Cuisine", room: "200" },
//       { name: "Cisco Lab", room: "201" },
//     ],
//     third: [
//       { name: "Electronics Lab", room: "304" },
//       { name: "School of Music", room: "303" },
//       { name: "Multimedia Lab", room: "301" },
//       { name: "Telecom Lab", room: "300" },
//     ],
//   },
//   staff: [
//     {
//       name: "Anthony Tannoury",
//       credentials: "PhD",
//       title: "DeanΓÇÖs Delegate",
//       phone: "+961 8 902020",
//       email: "anthony.tannoury@ua.edu.lb"
//     },
//     {
//       name: "Michel Tannoury",
//       title: "Senior Lecturer",
//       phone: "+961 8 902020 - 30 - 40 ext. 4111",
//       email: "michel.tannoury@ua.edu.lb"
//     },
//     {
//       name: "Mirna Achkouty",
//       title: "Administrative Assistant",
//       phone: "+961 8 902020",
//       email: "mirna.achkouty@ua.edu.lb"
//     },
//     {
//       name: "Faculty of Engineering and Technology",
//       title: "",
//       phone: "+961 8 902020",
//       email: "assistant.foe@ua.edu.lb"
//     },
//     {
//       name: "Chady Abou Jaoude",
//       credentials: "PhD",
//       title: "Associate Professor, Dean",
//       phone: "+961 5 927000 ext. 2100",
//       email: "chady.aboujaoude@ua.edu.lb"
//     },
//     {
//       name: "Kabalan Chaccour",
//       credentials: "PhD",
//       title: "Head of the Department of Computer and Communications Engineering",
//       phone: "+961 5 927000 ext. 2122",
//       email: "kabalan.chaccour@ua.edu.lb"
//     },
//     {
//       name: "Charbel El Gemayel",
//       credentials: "PhD",
//       title: "Head of the Department of Technology in Computer Science",
//       phone: "N/A",
//       email: "charbel.gemayel@ua.edu.lb"
//     }
//   ]
// };

// const staffDirectory = buildingInfo.staff.map(({ name, credentials, title, phone, email }) => {
//   const cred = credentials ? `, ${credentials}` : "";
//   return `${name}${cred} is the ${title}. You can reach them at ${phone}${email ? ` or email at ${email}` : ""}.`;
// }).join("\n");

// const campusDescription = `Antonine Zahle Campus Overview:
// [...]
// Staff Directory:
// ${staffDirectory}`;

// const predefinedQuestions = [
//   "Where is the Robotics Lab?",
//   "How to contact the Dean?",
//   "Where is the Library?",
//   "Where is the Cafeteria?",
//   "Who is Mirna Achkouty?",
// ];

// export default function ChatbotScreen() {
//   const [messages, setMessages] = useState([
//     {
//       id: '1',
//       text: "Hello! I'm your AI assistant for Antonine Zahle Campus. How can I help you today?",
//       isBot: true,
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputText, setInputText] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const flatListRef = useRef(null);

//   const sendMessage = async (customQuestion) => {
//     const question = customQuestion || inputText.trim();
//     if (!question) return;

//     const userMessage = {
//       id: Date.now().toString(),
//       text: question,
//       isBot: false,
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputText('');
//     setIsTyping(true);

//     const prompt = `
// You are a helpful assistant for Antonine Zahle Campus. Only answer using the information below.

// Campus:
// ${campusDescription}

// Question: ${question}
// `;

//     try {
//       const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Authorization': 'Bearer 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',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           model: 'deepseek/deepseek-r1-0528:free',
//           messages: [
//             { role: 'system', content: 'You are a helpful assistant that provides information about Antonine Zahle Campus.' },
//             { role: 'user', content: prompt }
//           ],
//           temperature: 0.2,
//           max_tokens: 256
//         }),
//       });

//       const data = await response.json();
//       const botMessage = {
//         id: (Date.now() + 1).toString(),
//         text: data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't understand that.",
//         isBot: true,
//         timestamp: new Date(),
//       };

//       setMessages(prev => [...prev, botMessage]);
//     } catch (err) {
//       console.error("Assistant error:", err);
//       setMessages(prev => [...prev, {
//         id: (Date.now() + 1).toString(),
//         text: "Sorry, I couldn't reach the assistant right now.",
//         isBot: true,
//         timestamp: new Date(),
//       }]);
//     }

//     setIsTyping(false);
//   };

//   const renderMessage = ({ item }) => (
//     <View style={[
//       styles.messageContainer,
//       { justifyContent: item.isBot ? 'flex-start' : 'flex-end' }
//     ]}>
//       {item.isBot && <Avatar.Icon size={28} icon="robot" style={{ marginRight: 6 }} />}
//       <View style={[
//         styles.messageBubble,
//         { backgroundColor: item.isBot ? '#f1f1f1' : '#007AFF' }
//       ]}>
//         <Text style={{ color: item.isBot ? '#000' : '#fff' }}>{item.text}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         keyExtractor={item => item.id}
//         renderItem={renderMessage}
//         contentContainerStyle={styles.chatContainer}
//       />

//       {/* ≡ƒö╣ Predefined Questions */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestions}>
//         {predefinedQuestions.map((question, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.questionButton}
//             onPress={() => sendMessage(question)}
//           >
//             <Text style={styles.questionText}>{question}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* ≡ƒö╣ Text Input */}
//       <View style={styles.inputArea}>
//         <TextInput
//           style={styles.textInput}
//           placeholder="Ask a question..."
//           value={inputText}
//           onChangeText={setInputText}
//         />
//         <IconButton icon="send" onPress={() => sendMessage()} disabled={isTyping || !inputText.trim()} />
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   chatContainer: {
//     padding: 12,
//     paddingBottom: 8,
//   },
//   messageContainer: {
//     flexDirection: 'row',
//     marginVertical: 6,
//     alignItems: 'flex-end',
//   },
//   messageBubble: {
//     padding: 10,
//     borderRadius: 16,
//     maxWidth: '75%',
//   },
//   quickQuestions: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     backgroundColor: '#f9f9f9',
//     borderTopWidth: 1,
//     borderColor: '#ddd',
//   },
//   questionButton: {
//     backgroundColor: '#eee',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   questionText: {
//     color: '#333',
//     fontSize: 14,
//   },
//   inputArea: {
//     flexDirection: 'row',
//     padding: 8,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//   },
//   textInput: {
//     flex: 1,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     marginRight: 6,
//   },
// });

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { IconButton, Avatar } from 'react-native-paper';
import { useAuthStore } from '../../store/AuthStore'; // adjust path if needed
import Constants from 'expo-constants';

const predefinedQuestions = [
  "Where is the Robotics Lab?",
  "How to contact the Dean?",
  "Where is the Library?",
  "Where is the Cafeteria?",
  "Who is Mirna Achkouty?",
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your AI assistant for Antonine Zahle Campus. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const { authUser } = useAuthStore();

  const sendMessage = async (customQuestion) => {
    const question = customQuestion || inputText.trim();
    if (!question || !authUser?.token) return;

    const userMessage = {
      id: Date.now().toString(),
      text: question,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/chatbot/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      const botReply = data.answer || "Sorry, I couldn't understand that.";

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botReply,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong.",
        isBot: true,
        timestamp: new Date(),
      }]);
    }

    setIsTyping(false);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      { justifyContent: item.isBot ? 'flex-start' : 'flex-end' }
    ]}>
      {item.isBot && <Avatar.Icon size={28} icon="robot" style={{ marginRight: 6 }} />}
      <View style={[
        styles.messageBubble,
        { backgroundColor: item.isBot ? '#f1f1f1' : '#007AFF' }
      ]}>
        <Text style={{ color: item.isBot ? '#000' : '#fff' }}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestions}>
        {predefinedQuestions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={styles.questionButton}
            onPress={() => sendMessage(question)}
          >
            <Text style={styles.questionText}>{question}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask a question..."
          value={inputText}
          onChangeText={setInputText}
        />
        <IconButton icon="send" onPress={() => sendMessage()} disabled={isTyping || !inputText.trim()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    padding: 12,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 16,
    maxWidth: '75%',
  },
  quickQuestions: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  questionButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  questionText: {
    color: '#333',
    fontSize: 14,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
});
