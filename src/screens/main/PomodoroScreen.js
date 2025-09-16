// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   Vibration,
//   AppState,
// } from 'react-native';
// import {
//   Card,
//   Title,
//   Button,
//   Portal,
//   Modal,
//   TextInput,
//   ProgressBar,
// } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import NotificationService from '../../services/NotificationService';
// import { usePomodoro } from '../../hooks/usePomodoro';

// const PomodoroScreen = () => {
//   const [isRunning, setIsRunning] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(25 * 60);
//   const [currentMode, setCurrentMode] = useState('work');
//   const [completedPomodoros, setCompletedPomodoros] = useState(0);
//   const [totalPomodoros, setTotalPomodoros] = useState(0);
//   const [settingsVisible, setSettingsVisible] = useState(false);
//   const [statsVisible, setStatsVisible] = useState(false);
//   const [settings, setSettings] = useState({
//     workDuration: 25,
//     shortBreakDuration: 5,
//     longBreakDuration: 15,
//     longBreakInterval: 4,
//     soundEnabled: true,
//     vibrationEnabled: true,
//   });

//   const { stats, recordSession } = usePomodoro();

//   const intervalRef = useRef(null);
//   const soundRef = useRef(null);
//   const appStateRef = useRef(AppState.currentState);

//   const modes = {
//     work: {
//       name: 'Work',
//       duration: settings.workDuration * 60,
//       color: '#d32f2f',
//       icon: 'briefcase-outline',
//     },
//     shortBreak: {
//       name: 'Short Break',
//       duration: settings.shortBreakDuration * 60,
//       color: '#388e3c',
//       icon: 'cafe-outline',
//     },
//     longBreak: {
//       name: 'Long Break',
//       duration: settings.longBreakDuration * 60,
//       color: '#1976d2',
//       icon: 'bed-outline',
//     },
//   };

//   useEffect(() => {
//     loadSettings();
//     loadSound();

//     const handleAppStateChange = (nextAppState) => {
//       if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
//         // App came to foreground
//       }
//       appStateRef.current = nextAppState;
//     };

//     const subscription = AppState.addEventListener('change', handleAppStateChange);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       subscription?.remove();
//     };
//   }, []);

//   useEffect(() => {
//     setTimeLeft(modes[currentMode].duration);
//   }, [currentMode, settings]);

//   const loadSettings = async () => {
//     try {
//       const savedSettings = await AsyncStorage.getItem('pomodoroSettings');
//       if (savedSettings) {
//         setSettings(JSON.parse(savedSettings));
//       }
//     } catch (error) {
//       console.error('Error loading settings:', error);
//     }
//   };

//   const saveSettings = async (newSettings) => {
//     try {
//       await AsyncStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
//       setSettings(newSettings);
//     } catch (error) {
//       console.error('Error saving settings:', error);
//     }
//   };

//   const loadSound = async () => {
//     console.log('Sound loading skipped for now');
//   };

//   const playNotificationSound = async () => {
//     if (settings.soundEnabled) {
//       console.log('Notification sound would play here');
//     }
//   };

//   const startTimer = () => {
//     setIsRunning(true);
//     intervalRef.current = setInterval(() => {
//       setTimeLeft((prevTime) => {
//         if (prevTime <= 1) {
//           handleTimerComplete();
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);
//   };

//   const pauseTimer = () => {
//     setIsRunning(false);
//     if (intervalRef.current) clearInterval(intervalRef.current);
//   };

//   const resetTimer = () => {
//     setIsRunning(false);
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     setTimeLeft(modes[currentMode].duration);
//   };

//   const handleTimerComplete = async () => {
//     setIsRunning(false);
//     if (intervalRef.current) clearInterval(intervalRef.current);

//     playNotificationSound();

//     if (settings.vibrationEnabled) {
//       Vibration.vibrate([0, 500, 200, 500]);
//     }

//     if (currentMode === 'work') {
//       const newCompleted = completedPomodoros + 1;
//       setCompletedPomodoros(newCompleted);
//       setTotalPomodoros(totalPomodoros + 1);

//       // Record session to backend
//       await recordSession({ duration: settings.workDuration, type: 'work' });

//       await NotificationService.scheduleLocalNotification(
//         'Work Session Complete!',
//         'Great job! Time for a well-deserved break.',
//         { type: 'pomodoro', sessionType: 'work' }
//       );

//       if (newCompleted % settings.longBreakInterval === 0) {
//         setCurrentMode('longBreak');
//         Alert.alert('Work Complete!', 'Time for a long break!');
//       } else {
//         setCurrentMode('shortBreak');
//         Alert.alert('Work Complete!', 'Time for a short break!');
//       }
//     } else {
//       await NotificationService.scheduleLocalNotification(
//         'Break Time Over!',
//         'Break time is over. Ready to get back to work?',
//         { type: 'pomodoro', sessionType: 'break' }
//       );
//       setCurrentMode('work');
//       Alert.alert('Break Complete!', 'Time to get back to work!');
//     }
//   };

//   const switchMode = (mode) => {
//     resetTimer();
//     setCurrentMode(mode);
//   };

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
//       .toString()
//       .padStart(2, '0')}`;
//   };

//   const getProgress = () => {
//     const total = modes[currentMode].duration;
//     return (total - timeLeft) / total;
//   };

//   const renderModeSelector = () => (
//     <View style={styles.modeSelector}>
//       {Object.entries(modes).map(([key, mode]) => (
//         <TouchableOpacity
//           key={key}
//           style={[
//             styles.modeButton,
//             currentMode === key && { backgroundColor: mode.color },
//           ]}
//           onPress={() => switchMode(key)}
//           disabled={isRunning}
//         >
//           <Ionicons
//             name={mode.icon}
//             size={20}
//             color={currentMode === key ? '#fff' : mode.color}
//           />
//           <Text
//             style={[
//               styles.modeButtonText,
//               currentMode === key && { color: '#fff' },
//             ]}
//           >
//             {mode.name}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   const renderTimer = () => (
//     <Card style={[styles.timerCard, { borderColor: modes[currentMode].color }]}>
//       <Card.Content style={styles.timerContent}>
//         <View style={styles.timerHeader}>
//           <Ionicons
//             name={modes[currentMode].icon}
//             size={32}
//             color={modes[currentMode].color}
//           />
//           <Title style={[styles.modeTitle, { color: modes[currentMode].color }]}>
//             {modes[currentMode].name}
//           </Title>
//         </View>

//         <Text style={[styles.timerText, { color: modes[currentMode].color }]}>
//           {formatTime(timeLeft)}
//         </Text>

//         <ProgressBar
//           progress={getProgress()}
//           color={modes[currentMode].color}
//           style={styles.progressBar}
//         />

//         <View style={styles.timerControls}>
//           {!isRunning ? (
//             <Button
//               mode="contained"
//               onPress={startTimer}
//               style={[styles.controlButton, { backgroundColor: modes[currentMode].color }]}
//               icon="play"
//             >
//               Start
//             </Button>
//           ) : (
//             <Button
//               mode="contained"
//               onPress={pauseTimer}
//               style={[styles.controlButton, { backgroundColor: modes[currentMode].color }]}
//               icon="pause"
//             >
//               Pause
//             </Button>
//           )}

//           <Button
//             mode="outlined"
//             onPress={resetTimer}
//             style={[styles.controlButton, { borderColor: modes[currentMode].color }]}
//             textColor={modes[currentMode].color}
//             icon="refresh"
//           >
//             Reset
//           </Button>
//         </View>
//       </Card.Content>
//     </Card>
//   );

//   const renderStats = () => (
//     <Card style={styles.statsCard}>
//       <Card.Content>
//         <Title style={styles.statsTitle}>Today's Progress</Title>
//         <View style={styles.statsRow}>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{completedPomodoros}</Text>
//             <Text style={styles.statLabel}>Completed</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{stats.todaySessions}</Text>
//             <Text style={styles.statLabel}>Today</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{Math.floor(stats.totalMinutes / 60)}h</Text>
//             <Text style={styles.statLabel}>Total Time</Text>
//           </View>
//         </View>
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <View style={styles.container}>
//       {renderModeSelector()}
//       {renderTimer()}
//       {renderStats()}

//       <View style={styles.actionButtons}>
//         <Button
//           mode="outlined"
//           onPress={() => setStatsVisible(true)}
//           style={styles.actionButton}
//           icon="chart-line"
//         >
//           Statistics
//         </Button>
//         <Button
//           mode="outlined"
//           onPress={() => setSettingsVisible(true)}
//           style={styles.actionButton}
//           icon="cog"
//         >
//           Settings
//         </Button>
//       </View>

//       {/* You can keep the Modal for settings and stats as before */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   modeSelector: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 4,
//     elevation: 2,
//   },
//   modeButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//     gap: 4,
//   },
//   modeButtonText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#666',
//   },
//   timerCard: {
//     marginBottom: 20,
//     elevation: 4,
//     borderWidth: 2,
//   },
//   timerContent: {
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   timerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginBottom: 20,
//   },
//   modeTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   timerText: {
//     fontSize: 64,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     fontFamily: 'monospace',
//   },
//   progressBar: {
//     width: '100%',
//     height: 8,
//     borderRadius: 4,
//     marginBottom: 30,
//   },
//   timerControls: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   controlButton: {
//     minWidth: 100,
//   },
//   statsCard: {
//     marginBottom: 20,
//     elevation: 2,
//   },
//   statsTitle: {
//     textAlign: 'center',
//     marginBottom: 16,
//     color: '#333',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1976d2',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   actionButton: {
//     flex: 1,
//   },
//   modalContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     margin: 20,
//     borderRadius: 8,
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     marginBottom: 12,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//     marginTop: 20,
//   },
//   modalButton: {
//     flex: 1,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginBottom: 20,
//   },
//   statCard: {
//     flex: 1,
//     minWidth: '45%',
//     backgroundColor: '#f8f9fa',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   statCardNumber: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1976d2',
//   },
//   statCardLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
// });

// export default PomodoroScreen;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  AppState,
} from 'react-native';
import {
  Card,
  Title,
  Button,
  ProgressBar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../store/AuthStore';
import NotificationService from '../../services/NotificationService';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
const PomodoroScreen = () => {
  const { authUser } = useAuthStore();
  const token = authUser?.token;

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1 * 60);
  const [currentMode, setCurrentMode] = useState('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [stats, setStats] = useState({ totalMinutes: 0, todaySessions: 0 });

  const [settings, setSettings] = useState({
    workDuration: 1,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const modes = {
    work: { name: 'Work', duration: settings.workDuration * 60, color: '#d32f2f', icon: 'briefcase-outline' },
    shortBreak: { name: 'Short Break', duration: settings.shortBreakDuration * 60, color: '#388e3c', icon: 'cafe-outline' },
    longBreak: { name: 'Long Break', duration: settings.longBreakDuration * 60, color: '#1976d2', icon: 'bed-outline' },
  };

  useEffect(() => {
    loadSettings();
    fetchStats();

    const handleAppStateChange = (nextAppState) => {
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    setTimeLeft(modes[currentMode].duration);
  }, [currentMode, settings]);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('pomodoroSettings');
      if (saved) setSettings(JSON.parse(saved));
    } catch (err) {
      console.error('Load settings error:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/pomodoro/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setStats({
          totalMinutes: data.pomodoroStats?.totalHours ? data.pomodoroStats.totalHours * 60 : 0,
          todaySessions: data.pomodoroStats?.totalSessions || 0,
        });
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  const recordSession = async () => {
    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/pomodoro/session`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionMinutes: settings.workDuration }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchStats();
        console.log('Session recorded', data);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error('Record session error:', err);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(modes[currentMode].duration);
  };

  const handleTimerComplete = async () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (settings.vibrationEnabled) Vibration.vibrate([0, 500, 200, 500]);

    if (currentMode === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      await recordSession();

      await NotificationService.scheduleLocalNotification(
        'Work Session Complete!',
        'Time for a break.',
        { type: 'pomodoro', sessionType: 'work' }
      );

      if (newCompleted % settings.longBreakInterval === 0) {
        setCurrentMode('longBreak');
        Toast.show('Great work!', 'Time for a long break!');
      } else {
        setCurrentMode('shortBreak');
        Toast.show('Good job!', 'Take a short break.');
      }
    } else {
      await NotificationService.scheduleLocalNotification(
        'Break Over!',
        'Ready to start working again?',
        { type: 'pomodoro', sessionType: 'break' }
      );
      setCurrentMode('work');
      Toast.show('Break over!', 'Let’s go back to work!');
    }
  };

  const switchMode = (mode) => {
    resetTimer();
    setCurrentMode(mode);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = modes[currentMode].duration;
    return (total - timeLeft) / total;
  };

  return (
    <View style={styles.container}>
      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        {Object.entries(modes).map(([key, mode]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.modeButton,
              currentMode === key && { backgroundColor: mode.color },
            ]}
            onPress={() => switchMode(key)}
            disabled={isRunning}
          >
            <Ionicons
              name={mode.icon}
              size={20}
              color={currentMode === key ? '#fff' : mode.color}
            />
            <Text
              style={[
                styles.modeButtonText,
                currentMode === key && { color: '#fff' },
              ]}
            >
              {mode.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Card */}
      <Card style={[styles.timerCard, { borderColor: modes[currentMode].color }]}>
        <Card.Content style={styles.timerContent}>
          <View style={styles.timerHeader}>
            <Ionicons name={modes[currentMode].icon} size={32} color={modes[currentMode].color} />
            <Title style={{ color: modes[currentMode].color }}>{modes[currentMode].name}</Title>
          </View>

          <Text style={[styles.timerText, { color: modes[currentMode].color }]}>
            {formatTime(timeLeft)}
          </Text>

          <ProgressBar progress={getProgress()} color={modes[currentMode].color} style={styles.progressBar} />

          <View style={styles.timerControls}>
            {!isRunning ? (
              <Button mode="contained" onPress={startTimer} icon="play" style={{ backgroundColor: modes[currentMode].color }}>
                Start
              </Button>
            ) : (
              <Button mode="contained" onPress={pauseTimer} icon="pause" style={{ backgroundColor: modes[currentMode].color }}>
                Pause
              </Button>
            )}
            <Button mode="outlined" onPress={resetTimer} icon="refresh" textColor={modes[currentMode].color}>
              Reset
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Stats */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.statsTitle}>Today's Progress</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedPomodoros}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.todaySessions}</Text>
              <Text style={styles.statLabel}>All</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.floor(stats.totalMinutes)}m</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  modeSelector: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#fff', borderRadius: 12, padding: 4 },
  modeButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 8, gap: 4 },
  modeButtonText: { fontSize: 12, fontWeight: '500', color: '#666' },
  timerCard: { marginBottom: 20, elevation: 4, borderWidth: 2 },
  timerContent: { alignItems: 'center', paddingVertical: 20 },
  timerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  timerText: { fontSize: 64, fontWeight: 'bold', marginBottom: 20, fontFamily: 'monospace' },
  progressBar: { width: '100%', height: 8, borderRadius: 4, marginBottom: 30 },
  timerControls: { flexDirection: 'row', gap: 16 },
  statsCard: { marginBottom: 20, elevation: 2 },
  statsTitle: { textAlign: 'center', marginBottom: 16, color: '#333' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#1976d2' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
});

export default PomodoroScreen;
