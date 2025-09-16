// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import {
//   Text,
//   Avatar,
//   Button,
//   Divider,
//   ActivityIndicator,
//   Title,
//   Card,
// } from 'react-native-paper';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import { useAuthStore } from '../../store/AuthStore';
// import Constants from 'expo-constants';
// const ProfileScreen = () => {
//   const { authUser } = useAuthStore();
//   const [user, setUser] = useState(null);
//   const [schedule, setSchedule] = useState([]);
//   const [pomodoroStats, setPomodoroStats] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const token = authUser?.token;

//   useEffect(() => {
//     if (!authUser) return;
//     fetchUserData();
//     fetchSchedule();
//     fetchPomodoroStats();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const res = await axios.get(`${Constants.expoConfig.extra.API_BASE_URL}/users/${authUser._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(res.data);
//     } catch (err) {
//       console.error('Error fetching user:', err);
//     }
//   };

//   const fetchSchedule = async () => {
//     try {
//       const res = await axios.get(`${Constants.expoConfig.extra.API_BASE_URLL}/sch/${authUser._id}/schedule`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSchedule(res.data);
//     } catch (err) {
//       console.error('Error fetching schedule:', err);
//     }
//   };

//   const fetchPomodoroStats = async () => {
//     try {
//       const res = await axios.get(`${Constants.expoConfig.extra.API_BASE_URL}/pomodoro/stats`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPomodoroStats(res.data);
//     } catch (err) {
//       console.error('Error fetching pomodoro stats:', err);
//     }
//   };

//   const pickAndUploadImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       quality: 1,
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     });

//     if (!result.cancelled && result.assets?.length > 0) {
//       const uri = result.assets[0].uri;
//       const formData = new FormData();
//       formData.append('avatar', {
//         uri,
//         name: 'profile.jpg',
//         type: 'image/jpeg',
//       });

//       try {
//         setUploading(true);
//         const res = await axios.patch(
//           `${Constants.expoConfig.extra.API_BASE_URL}/users/${authUser._id}/profile-pic`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//         fetchUserData(); // refresh image
//       } catch (err) {
//         console.error('Upload error:', err);
//       } finally {
//         setUploading(false);
//       }
//     }
//   };

//   if (!user) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

// return (
//     <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.profileSection}>
//             <TouchableOpacity onPress={pickAndUploadImage}>
//                 {uploading ? (
//                     <ActivityIndicator />
//                 ) : (
//                     <Avatar.Image
//                         size={100}
//                         source={
//                             user.profilePic
//                                 ? { uri: user.profilePic }
//                                 : undefined
//                         }
//                     />
//                 )}
//             </TouchableOpacity>
//             <Title style={styles.title}>{user.name}</Title>
//             <Text>{user.email}</Text>
//             <Text style={styles.role}>{user.role}</Text>
//         </View>

//         <Divider style={styles.divider} />

//         <Text style={styles.sectionTitle}>📆 Weekly Schedule</Text>
//         {schedule.length === 0 ? (
//             <Text style={styles.noData}>No schedule available</Text>
//         ) : (
//             schedule.map((item, idx) => (
//                 <Card key={idx} style={styles.card}>
//                     <Card.Content>
//                         <Text>{item.day} - {item.startTime} ➡ {item.endTime}</Text>
//                         <Text>Subject: {item.subject}</Text>
//                         <Text>Location: {item.location}</Text>
//                     </Card.Content>
//                 </Card>
//             ))
//         )}

//         <Divider style={styles.divider} />

//         <Text style={styles.sectionTitle}>⏱️ Pomodoro Stats</Text>
//         {pomodoroStats ? (
//             <View style={styles.pomodoroBox}>
//                 <Text>Total Pomodoros: {pomodoroStats.totalPomodoros}</Text>
//                 <Text>Total Focus Time: {pomodoroStats.totalMinutes} mins</Text>
//                 <Text>Last Session: {pomodoroStats.lastSession}</Text>
//             </View>
//         ) : (
//             <Text style={styles.noData}>No pomodoro stats available</Text>
//         )}

//         <View style={styles.buttonContainer}>
//             <Button
//                 icon="logout"
//                 mode="contained"
//                 onPress={() => {
//                     // Add your logout logic here
//                     // Example: useAuthStore().logout();
//                     console.log('Logout clicked');
//                 }}
//                 style={styles.logoutButton}
//             >
//                 Logout
//             </Button>
//         </View>
//     </ScrollView>
// );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     marginTop: 8,
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   role: {
//     marginTop: 4,
//     fontSize: 14,
//     color: 'gray',
//   },
//   divider: {
//     marginVertical: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   noData: {
//     color: 'gray',
//     fontStyle: 'italic',
//     marginBottom: 8,
//   },
//   card: {
//     marginBottom: 10,
//     backgroundColor: '#f9f9f9',
//   },
//   pomodoroBox: {
//     padding: 12,
//     backgroundColor: '#eaf4ff',
//     borderRadius: 8,
//   },
//   buttonContainer: {
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   logoutButton: {
//     width: '60%',
//     backgroundColor: '#d32f2f',
//   },
// });

// export default ProfileScreen;
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import {
//   Text,
//   Avatar,
//   Button,
//   Divider,
//   ActivityIndicator,
//   Title,
//   Card,
// } from 'react-native-paper';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import { useAuthStore } from '../../store/AuthStore';
// import Constants from 'expo-constants';

// const ProfileScreen = () => {
//   const { authUser, logout } = useAuthStore();
//   const [user, setUser] = useState(null);
//   const [schedule, setSchedule] = useState([]);
//   const [pomodoroStats, setPomodoroStats] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const token = authUser?.token;

//   useEffect(() => {
//     if (!authUser) return;
//     (async () => {
//       try {
//         await Promise.all([
//           fetchUserData(),
//           fetchSchedule(),
//           fetchPomodoroStats(),
//         ]);
//       } catch (error) {
//         console.error('Error initializing profile screen:', error);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [authUser]);

//   const fetchUserData = async () => {
//     try {
//       const res = await axios.get(
//         `${Constants.expoConfig.extra.API_BASE_URL}/users/${authUser._id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setUser(res.data);
//     } catch (err) {
//       console.error('Error fetching user:', err);
//     }
//   };

//   const fetchSchedule = async () => {
//     try {
//       const res = await axios.get(
//         `${Constants.expoConfig.extra.API_BASE_URL}/sch/${authUser._id}/schedule`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSchedule(res.data);
//     } catch (err) {
//       console.error('Error fetching schedule:', err);
//     }
//   };

//   const fetchPomodoroStats = async () => {
//     try {
//       const res = await axios.get(
//         `${Constants.expoConfig.extra.API_BASE_URL}/pomodoro/stats`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPomodoroStats(res.data);
//     } catch (err) {
//       console.error('Error fetching pomodoro stats:', err);
//     }
//   };

//   const pickAndUploadImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         allowsEditing: true,
//         quality: 1,
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       });

//       // Check for result not canceled (some SDK versions use 'canceled', others 'cancelled')
//       if (!result.canceled && !result.cancelled && result.assets?.length > 0) {
//         const uri = result.assets[0].uri;
//         const formData = new FormData();
//         formData.append('avatar', {
//           uri,
//           name: 'profile.jpg',
//           type: 'image/jpeg',
//         });

//         setUploading(true);
//         await axios.patch(
//           `${Constants.expoConfig.extra.API_BASE_URL}/users/${authUser._id}/profile-pic`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//         await fetchUserData(); // refresh profile picture
//       }
//     } catch (err) {
//       console.error('Upload error:', err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.center}>
//         <Text>No user data available.</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.profileSection}>
//         <TouchableOpacity onPress={pickAndUploadImage}>
//           {uploading ? (
//             <ActivityIndicator />
//           ) : (
//             <Avatar.Image
//               size={100}
//               source={user.profilePic ? { uri: user.profilePic } : undefined}
//             />
//           )}
//         </TouchableOpacity>
//         <Title style={styles.title}>{user.name}</Title>
//         <Text>{user.email}</Text>
//         <Text style={styles.role}>{user.role}</Text>
//       </View>

//       <Divider style={styles.divider} />

//       <Text style={styles.sectionTitle}>📆 Weekly Schedule</Text>
//       {schedule.length === 0 ? (
//         <Text style={styles.noData}>No schedule available</Text>
//       ) : (
//         schedule.map((item, idx) => (
//           <Card key={idx} style={styles.card}>
//             <Card.Content>
//               <Text>
//                 {item.day} - {item.startTime} ➡ {item.endTime}
//               </Text>
//               <Text>Subject: {item.subject}</Text>
//               <Text>Location: {item.location}</Text>
//             </Card.Content>
//           </Card>
//         ))
//       )}

//       <Divider style={styles.divider} />

//       <Text style={styles.sectionTitle}>⏱️ Pomodoro Stats</Text>
//       {pomodoroStats ? (
//         <View style={styles.pomodoroBox}>
//           <Text>Total Pomodoros: {pomodoroStats.totalPomodoros}</Text>
//           <Text>Total Focus Time: {pomodoroStats.totalMinutes} mins</Text>
//           <Text>Last Session: {pomodoroStats.lastSession}</Text>
//         </View>
//       ) : (
//         <Text style={styles.noData}>No pomodoro stats available</Text>
//       )}

//       <View style={styles.buttonContainer}>
//         <Button
//           icon="logout"
//           mode="contained"
//           onPress={() => {
//             if (logout) logout();
//             else console.log('Logout function not implemented.');
//           }}
//           style={styles.logoutButton}
//         >
//           Logout
//         </Button>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     marginTop: 8,
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   role: {
//     marginTop: 4,
//     fontSize: 14,
//     color: 'gray',
//   },
//   divider: {
//     marginVertical: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   noData: {
//     color: 'gray',
//     fontStyle: 'italic',
//     marginBottom: 8,
//   },
//   card: {
//     marginBottom: 10,
//     backgroundColor: '#f9f9f9',
//   },
//   pomodoroBox: {
//     padding: 12,
//     backgroundColor: '#eaf4ff',
//     borderRadius: 8,
//   },
//   buttonContainer: {
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   logoutButton: {
//     width: '60%',
//     backgroundColor: '#d32f2f',
//   },
// });

// export default ProfileScreen;







import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Avatar,
  Button,
  Divider,
  ActivityIndicator,
  Title,
  Card,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuthStore } from '../../store/AuthStore';
import Constants from 'expo-constants';

const ProfileScreen = () => {
  const { authUser, logout } = useAuthStore();
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [pomodoroStats, setPomodoroStats] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = authUser?.token;

  useEffect(() => {
    if (!authUser) return;

    (async () => {
      try {
        await Promise.all([fetchUserData(), fetchSchedule(), fetchPomodoroStats()]);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [authUser]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `${Constants.expoConfig.extra.API_BASE_URL}/users/${authUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(
        `${Constants.expoConfig.extra.API_BASE_URL}/sch/${authUser._id}/schedule`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSchedule(res.data);
    } catch (err) {
      console.error('Error fetching schedule:', err);
    }
  };

  const fetchPomodoroStats = async () => {
    try {
      const res = await axios.get(
        `${Constants.expoConfig.extra.API_BASE_URL}/pomodoro/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Pomodoro stats response:', res.data);
      setPomodoroStats(res.data.pomodoroStats); // <-- Important fix here
    } catch (err) {
      console.error('Error fetching pomodoro stats:', err.response || err.message);
    }
  };

  const pickAndUploadImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && !result.cancelled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        const formData = new FormData();
        formData.append('avatar', {
          uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });

        setUploading(true);
        await axios.patch(
          `${Constants.expoConfig.extra.API_BASE_URL}/users/${authUser._id}/profile-pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        await fetchUserData(); // Refresh user data to update avatar
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>No user data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickAndUploadImage}>
          {uploading ? (
            <ActivityIndicator />
          ) : (
            <Avatar.Image
              size={100}
              source={user.profilePic ? { uri: user.profilePic } : undefined}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.title}>{user.firstName +" "+user.lastName}</Text>
        <Text>{user.email}</Text>
        <Text style={styles.role}>{user.role}</Text>
      </View>

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>📆 Weekly Schedule</Text>
      {schedule.length === 0 ? (
        <Text style={styles.noData}>No schedule available</Text>
      ) : (
        schedule.map((item, idx) => (
          <Card key={idx} style={styles.card}>
            <Card.Content>
              <Text>
                {item.day} - {item.startTime} ➡ {item.endTime}
              </Text>
              <Text>Subject: {item.subject}</Text>
              <Text>Location: {item.location}</Text>
            </Card.Content>
          </Card>
        ))
      )}

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>⏱️ Pomodoro Stats</Text>
      {pomodoroStats ? (
        <View style={styles.pomodoroBox}>
          <Text>Total Pomodoros: {pomodoroStats.totalSessions?.toFixed ? pomodoroStats.totalSessions.toFixed(2) : pomodoroStats.totalHours}</Text>
          <Text>Total Focus Time: {pomodoroStats.totalHours ? (pomodoroStats.totalHours * 60).toFixed(0) : 0} mins</Text>
          <Text>Last Session: {pomodoroStats.totalSessions}</Text>
        </View>
      ) : (
        <Text style={styles.noData}>No pomodoro stats available</Text>
      )}

      {/* <View style={styles.buttonContainer}>
        <Button
          icon="logout"
          mode="contained"
          onPress={() => {
            if (logout) {
              useAuthStore.getState().clearAuth();
            }
            else console.log('Logout function not implemented.');
          }}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: 'bold',
  },
  role: {
    marginTop: 4,
    fontSize: 14,
    color: 'gray',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  noData: {
    color: 'gray',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  pomodoroBox: {
    padding: 12,
    backgroundColor: '#eaf4ff',
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  logoutButton: {
    width: '60%',
    backgroundColor: '#d32f2f',
  },
});

export default ProfileScreen;
