// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
// } from 'react-native';
// import { Card, FAB, Chip } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuthStore } from '../../store/AuthStore';
// import { colors, spacing, typography } from '../../constants/theme';

// export default function AnnouncementsScreen() {
//   const [announcements, setAnnouncements] = useState([
//     {
//       id: '1',
//       title: 'New Semester Registration',
//       content: 'Registration for the new semester will begin on January 15th. Please ensure all prerequisites are met.',
//       author: 'Admin Office',
//       createdAt: '2024-01-10T10:00:00Z',
//       priority: 'high',
//       category: 'Academic',
//     },
//     {
//       id: '2',
//       title: 'Library Hours Update',
//       content: 'The library will have extended hours during exam week. Open 24/7 from January 20-27.',
//       author: 'Library Services',
//       createdAt: '2024-01-08T14:30:00Z',
//       priority: 'medium',
//       category: 'Services',
//     },
//   ]);

//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const { authUser } = useAuthStore();

//   const categories = ['All', 'Academic', 'Services', 'Events', 'Emergency'];
//   const isAdmin = authUser?.role === 'admin';

//   const filteredAnnouncements = announcements.filter(announcement =>
//     selectedCategory === 'All' || announcement.category === selectedCategory
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     // Implement refresh logic here
//     setTimeout(() => setRefreshing(false), 1000);
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return colors.error;
//       case 'medium': return colors.warning;
//       case 'low': return colors.success;
//       default: return colors.gray;
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const renderAnnouncementItem = ({ item }) => (
//     <Card style={styles.announcementCard}>
//       <Card.Content style={styles.cardContent}>
//         <View style={styles.announcementHeader}>
//           <View style={styles.headerLeft}>
//             <Text style={styles.announcementTitle}>{item.title}</Text>
//             <View style={styles.metaInfo}>
//               <Text style={styles.authorText}>By {item.author}</Text>
//               <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
//             </View>
//           </View>
//           <View style={styles.headerRight}>
//             <View style={[
//               styles.priorityBadge,
//               { backgroundColor: getPriorityColor(item.priority) }
//             ]}>
//               <Text style={styles.priorityText}>
//                 {item.priority.toUpperCase()}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <Text style={styles.announcementContent}>{item.content}</Text>

//         <View style={styles.announcementFooter}>
//           <Chip
//             style={styles.categoryChip}
//             textStyle={styles.categoryText}
//           >
//             {item.category}
//           </Chip>
//         </View>
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Category Filter */}
//       <View style={styles.filterContainer}>
//         <FlatList
//           data={categories}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <Chip
//               selected={selectedCategory === item}
//               onPress={() => setSelectedCategory(item)}
//               style={[
//                 styles.categoryFilterChip,
//                 selectedCategory === item && styles.selectedFilterChip
//               ]}
//               textStyle={[
//                 styles.filterChipText,
//                 selectedCategory === item && styles.selectedFilterChipText
//               ]}
//             >
//               {item}
//             </Chip>
//           )}
//           keyExtractor={(item) => item}
//           contentContainerStyle={styles.filterChipContainer}
//         />
//       </View>

//       {/* Announcements List */}
//       <FlatList
//         data={filteredAnnouncements}
//         renderItem={renderAnnouncementItem}
//         keyExtractor={(item) => item.id}
//         style={styles.announcementsList}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="megaphone-outline" size={64} color={colors.gray} />
//             <Text style={styles.emptyText}>No announcements found</Text>
//             <Text style={styles.emptySubtext}>
//               Check back later for updates
//             </Text>
//           </View>
//         }
//       />

//       {/* Add Announcement FAB (Admin only) */}
//       {isAdmin && (
//         <FAB
//           style={styles.fab}
//           icon="plus"
//           onPress={() => {
//             // Navigate to create announcement screen
//           }}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   filterContainer: {
//     backgroundColor: colors.white,
//     paddingVertical: spacing.md,
//     elevation: 2,
//   },
//   filterChipContainer: {
//     paddingHorizontal: spacing.md,
//   },
//   categoryFilterChip: {
//     marginRight: spacing.sm,
//     backgroundColor: colors.lightGray,
//   },
//   selectedFilterChip: {
//     backgroundColor: colors.primary,
//   },
//   filterChipText: {
//     color: colors.text,
//   },
//   selectedFilterChipText: {
//     color: colors.white,
//   },
//   announcementsList: {
//     flex: 1,
//   },
//   listContent: {
//     padding: spacing.md,
//   },
//   announcementCard: {
//     marginBottom: spacing.md,
//     elevation: 2,
//   },
//   cardContent: {
//     padding: spacing.md,
//   },
//   announcementHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: spacing.md,
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   headerRight: {
//     marginLeft: spacing.md,
//   },
//   announcementTitle: {
//     ...typography.h6,
//     color: colors.text,
//     marginBottom: spacing.xs,
//   },
//   metaInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   authorText: {
//     ...typography.caption,
//     color: colors.primary,
//     marginRight: spacing.md,
//   },
//   dateText: {
//     ...typography.caption,
//     color: colors.textSecondary,
//   },
//   priorityBadge: {
//     paddingHorizontal: spacing.sm,
//     paddingVertical: spacing.xs,
//     borderRadius: 12,
//   },
//   priorityText: {
//     ...typography.caption,
//     color: colors.white,
//     fontWeight: 'bold',
//   },
//   announcementContent: {
//     ...typography.body1,
//     color: colors.text,
//     lineHeight: 24,
//     marginBottom: spacing.md,
//   },
//   announcementFooter: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   categoryChip: {
//     backgroundColor: colors.lightGray,
//   },
//   categoryText: {
//     ...typography.caption,
//     color: colors.textSecondary,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: spacing.xxl,
//   },
//   emptyText: {
//     ...typography.h6,
//     color: colors.textSecondary,
//     marginTop: spacing.md,
//   },
//   emptySubtext: {
//     ...typography.body2,
//     color: colors.gray,
//     marginTop: spacing.xs,
//   },
//   fab: {
//     position: 'absolute',
//     margin: spacing.md,
//     right: 0,
//     bottom: 0,
//     backgroundColor: colors.primary,
//   },
// });


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   RefreshControl,
// } from 'react-native';
// import { Card, FAB, Chip } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuthStore } from '../../store/AuthStore';
// import { useAnnouncements } from '../../hooks/useAnnouncements';
// import { colors, spacing, typography } from '../../constants/theme';

// export default function AnnouncementsScreen() {
//   const { announcements, loading, fetchAnnouncements } = useAnnouncements();

//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const { authUser } = useAuthStore();

//   const categories = ['All', 'Academic', 'Services', 'Events', 'Emergency'];
//   const isAdmin = authUser?.role === 'admin';

//   const filteredAnnouncements = announcements.filter(
//     (announcement) =>
//       selectedCategory === 'All' || announcement.category === selectedCategory
//   );

//   const onRefresh = async () => {
//     await fetchAnnouncements();
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high':
//         return colors.error;
//       case 'medium':
//         return colors.warning;
//       case 'low':
//         return colors.success;
//       default:
//         return colors.gray;
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const renderAnnouncementItem = ({ item }) => (
//     <Card style={styles.announcementCard}>
//       <Card.Content style={styles.cardContent}>
//         <View style={styles.announcementHeader}>
//           <View style={styles.headerLeft}>
//             <Text style={styles.announcementTitle}>{item.title}</Text>
//             <View style={styles.metaInfo}>
//               <Text style={styles.authorText}>By {item.author}</Text>
//               <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
//             </View>
//           </View>
//           <View style={styles.headerRight}>
//             <View
//               style={[
//                 styles.priorityBadge,
//                 { backgroundColor: getPriorityColor(item.priority) },
//               ]}
//             >
//               <Text style={styles.priorityText}>
//                 {item.priority?.toUpperCase()}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <Text style={styles.announcementContent}>{item.content}</Text>

//         <View style={styles.announcementFooter}>
//           <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
//             {item.category}
//           </Chip>
//         </View>
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Category Filter */}
//       <View style={styles.filterContainer}>
//         <FlatList
//           data={categories}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <Chip
//               selected={selectedCategory === item}
//               onPress={() => setSelectedCategory(item)}
//               style={[
//                 styles.categoryFilterChip,
//                 selectedCategory === item && styles.selectedFilterChip,
//               ]}
//               textStyle={[
//                 styles.filterChipText,
//                 selectedCategory === item && styles.selectedFilterChipText,
//               ]}
//             >
//               {item}
//             </Chip>
//           )}
//           keyExtractor={(item) => item}
//           contentContainerStyle={styles.filterChipContainer}
//         />
//       </View>

//       {/* Announcements List */}
//       <FlatList
//         data={filteredAnnouncements}
//         renderItem={renderAnnouncementItem}
//         keyExtractor={(item) => item._id} // Backend uses _id
//         style={styles.announcementsList}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={loading} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons
//               name="megaphone-outline"
//               size={64}
//               color={colors.gray}
//             />
//             <Text style={styles.emptyText}>No announcements found</Text>
//             <Text style={styles.emptySubtext}>
//               Check back later for updates
//             </Text>
//           </View>
//         }
//       />

//       {/* Add Announcement FAB (Admin only) */}
//       {isAdmin && (
//         <FAB
//           style={styles.fab}
//           icon="plus"
//           onPress={() => {
//             // Navigate to create announcement screen or modal
//           }}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   filterContainer: {
//     backgroundColor: colors.white,
//     paddingVertical: spacing.md,
//     elevation: 2,
//   },
//   filterChipContainer: {
//     paddingHorizontal: spacing.md,
//   },
//   categoryFilterChip: {
//     marginRight: spacing.sm,
//     backgroundColor: colors.lightGray,
//   },
//   selectedFilterChip: {
//     backgroundColor: colors.primary,
//   },
//   filterChipText: {
//     color: colors.text,
//   },
//   selectedFilterChipText: {
//     color: colors.white,
//   },
//   announcementsList: {
//     flex: 1,
//   },
//   listContent: {
//     padding: spacing.md,
//   },
//   announcementCard: {
//     marginBottom: spacing.md,
//     elevation: 2,
//   },
//   cardContent: {
//     padding: spacing.md,
//   },
//   announcementHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: spacing.md,
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   headerRight: {
//     marginLeft: spacing.md,
//   },
//   announcementTitle: {
//     ...typography.h6,
//     color: colors.text,
//     marginBottom: spacing.xs,
//   },
//   metaInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   authorText: {
//     ...typography.caption,
//     color: colors.primary,
//     marginRight: spacing.md,
//   },
//   dateText: {
//     ...typography.caption,
//     color: colors.textSecondary,
//   },
//   priorityBadge: {
//     paddingHorizontal: spacing.sm,
//     paddingVertical: spacing.xs,
//     borderRadius: 12,
//   },
//   priorityText: {
//     ...typography.caption,
//     color: colors.white,
//     fontWeight: 'bold',
//   },
//   announcementContent: {
//     ...typography.body1,
//     color: colors.text,
//     lineHeight: 24,
//     marginBottom: spacing.md,
//   },
//   announcementFooter: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   categoryChip: {
//     backgroundColor: colors.lightGray,
//   },
//   categoryText: {
//     ...typography.caption,
//     color: colors.textSecondary,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: spacing.xxl,
//   },
//   emptyText: {
//     ...typography.h6,
//     color: colors.textSecondary,
//     marginTop: spacing.md,
//   },
//   emptySubtext: {
//     ...typography.body2,
//     color: colors.gray,
//     marginTop: spacing.xs,
//   },
//   fab: {
//     position: 'absolute',
//     margin: spacing.md,
//     right: 0,
//     bottom: 0,
//     backgroundColor: colors.primary,
//   },
// });





//-------------------------------------------------------------------------------------------------
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   RefreshControl,
//   ScrollView,
// } from 'react-native';
// import {
//   Card,
//   FAB,
//   Chip,
//   TextInput,
//   Button,
//   Modal,
//   Portal,
//   RadioButton,
//   HelperText,
// } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import { colors, spacing, typography } from '../../constants/theme';
// import { useAuthStore } from '../../store/AuthStore';
// import { useAnnouncements } from '../../hooks/useAnnouncements';

// export default function AnnouncementsScreen() {
//   const { authUser } = useAuthStore();
//   const {
//     announcements,
//     loading,
//     fetchAnnouncements,
//     createAnnouncement,
//   } = useAnnouncements();

//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [form, setForm] = useState({
//     title: '',
//     content: '',
//     category: '',
//     announcementType: '',
//     targetMajor: '',
//     targetSubject: '',
//   });

//   const isAdminOrTeacher = ['admin', 'teacher'].includes(authUser?.role);
//   const categories = ['All', 'Academic', 'Services', 'Events', 'Emergency'];
//   const majors = ['Computer Science', 'Engineering', 'Business'];
//   const subjects = ['Math', 'Algorithms', 'Data Structures'];

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchAnnouncements();
//     setRefreshing(false);
//   };

//   const handleCreate = async () => {
//     const payload = {
//       ...form,
//       targetMajor: form.announcementType === 'major' ? form.targetMajor : undefined,
//       targetSubject: form.announcementType === 'subject' ? form.targetSubject : undefined,
//     };

//     await createAnnouncement(payload);
//     setModalVisible(false);
//     setForm({
//       title: '',
//       content: '',
//       category: '',
//       announcementType: '',
//       targetMajor: '',
//       targetSubject: '',
//     });
//     fetchAnnouncements();
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return colors.error;
//       case 'medium': return colors.warning;
//       case 'low': return colors.success;
//       default: return colors.gray;
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const filteredAnnouncements = announcements?.filter(announcement =>
//     selectedCategory === 'All' || announcement.category === selectedCategory
//   );

//   const renderAnnouncementItem = ({ item }) => (
//     <Card style={styles.announcementCard}>
//       <Card.Content style={styles.cardContent}>
//         <View style={styles.announcementHeader}>
//           <View style={styles.headerLeft}>
//             <Text style={styles.announcementTitle}>{item.title}</Text>
//             <View style={styles.metaInfo}>
//               <Text style={styles.authorText}>By {item.author?.name || 'Admin'}</Text>
//               <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
//             </View>
//           </View>
//           <View style={styles.headerRight}>
//             <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority || 'low') }]}>
//               <Text style={styles.priorityText}>{(item.priority || 'low').toUpperCase()}</Text>
//             </View>
//           </View>
//         </View>
//         <Text style={styles.announcementContent}>{item.content}</Text>
//         <View style={styles.announcementFooter}>
//           <Chip style={styles.categoryChip} textStyle={styles.categoryText}>{item.category}</Chip>
//         </View>
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Category Filter */}
//       <View style={styles.filterContainer}>
//         <FlatList
//           data={categories}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <Chip
//               selected={selectedCategory === item}
//               onPress={() => setSelectedCategory(item)}
//               style={[
//                 styles.categoryFilterChip,
//                 selectedCategory === item && styles.selectedFilterChip,
//               ]}
//               textStyle={[
//                 styles.filterChipText,
//                 selectedCategory === item && styles.selectedFilterChipText,
//               ]}
//             >
//               {item}
//             </Chip>
//           )}
//           keyExtractor={(item) => item}
//           contentContainerStyle={styles.filterChipContainer}
//         />
//       </View>

//       {/* Announcements List */}
//       <FlatList
//         data={filteredAnnouncements}
//         renderItem={renderAnnouncementItem}
//         keyExtractor={(item) => item._id}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="megaphone-outline" size={64} color={colors.gray} />
//             <Text style={styles.emptyText}>No announcements found</Text>
//             <Text style={styles.emptySubtext}>Check back later for updates</Text>
//           </View>
//         }
//         contentContainerStyle={styles.listContent}
//       />

//       {/* FAB to open modal */}
//       {isAdminOrTeacher && (
//         <FAB icon="plus" style={styles.fab} onPress={() => setModalVisible(true)} />
//       )}

//       {/* Create Modal */}
//       <Portal>
//         <Modal visible={isModalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
//           <ScrollView>
//             <TextInput
//               label="Title"
//               value={form.title}
//               onChangeText={(text) => setForm({ ...form, title: text })}
//               style={styles.input}
//             />
//             <TextInput
//               label="Content"
//               value={form.content}
//               onChangeText={(text) => setForm({ ...form, content: text })}
//               multiline
//               style={styles.input}
//             />
//             <TextInput
//               label="Category"
//               value={form.category}
//               onChangeText={(text) => setForm({ ...form, category: text })}
//               style={styles.input}
//             />

//             <Text style={styles.label}>Type</Text>
//             <RadioButton.Group
//               onValueChange={(val) => setForm({ ...form, announcementType: val })}
//               value={form.announcementType}
//             >
//               <RadioButton.Item label="General" value="general" />
//               <RadioButton.Item label="Major" value="major" />
//               <RadioButton.Item label="Subject" value="subject" />
//             </RadioButton.Group>

//             {form.announcementType === 'major' && (
//               <TextInput
//                 label="Target Major"
//                 value={form.targetMajor}
//                 onChangeText={(text) => setForm({ ...form, targetMajor: text })}
//                 style={styles.input}
//               />
//             )}

//             {form.announcementType === 'subject' && (
//               <TextInput
//                 label="Target Subject"
//                 value={form.targetSubject}
//                 onChangeText={(text) => setForm({ ...form, targetSubject: text })}
//                 style={styles.input}
//               />
//             )}

//             <Button mode="contained" onPress={handleCreate} style={{ marginTop: spacing.md }}>
//               Submit
//             </Button>
//           </ScrollView>
//         </Modal>
//       </Portal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.background },
//   filterContainer: { backgroundColor: colors.white, paddingVertical: spacing.md, elevation: 2 },
//   filterChipContainer: { paddingHorizontal: spacing.md },
//   categoryFilterChip: { marginRight: spacing.sm, backgroundColor: colors.lightGray },
//   selectedFilterChip: { backgroundColor: colors.primary },
//   filterChipText: { color: colors.text },
//   selectedFilterChipText: { color: colors.white },
//   listContent: { padding: spacing.md },
//   announcementCard: { marginBottom: spacing.md, elevation: 2 },
//   cardContent: { padding: spacing.md },
//   announcementHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
//   headerLeft: { flex: 1 },
//   headerRight: { marginLeft: spacing.md },
//   announcementTitle: { ...typography.h6, color: colors.text, marginBottom: spacing.xs },
//   metaInfo: { flexDirection: 'row', alignItems: 'center' },
//   authorText: { ...typography.caption, color: colors.primary, marginRight: spacing.md },
//   dateText: { ...typography.caption, color: colors.textSecondary },
//   priorityBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 12 },
//   priorityText: { ...typography.caption, color: colors.white, fontWeight: 'bold' },
//   announcementContent: { ...typography.body1, color: colors.text, marginBottom: spacing.md, lineHeight: 22 },
//   announcementFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
//   categoryChip: { backgroundColor: colors.lightGray },
//   categoryText: { ...typography.caption, color: colors.textSecondary },
//   emptyContainer: { alignItems: 'center', paddingVertical: spacing.xxl },
//   emptyText: { ...typography.h6, color: colors.textSecondary, marginTop: spacing.md },
//   emptySubtext: { ...typography.body2, color: colors.gray, marginTop: spacing.xs },
//   fab: { position: 'absolute', margin: spacing.md, right: 0, bottom: 0, backgroundColor: colors.primary },
//   modal: { backgroundColor: 'white', padding: spacing.lg, margin: spacing.md, borderRadius: 12 },
//   input: { marginBottom: spacing.md },
//   label: { ...typography.subtitle2, color: colors.text, marginTop: spacing.md },
// });






// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   RefreshControl,
//   ScrollView,
// } from 'react-native';
// import {
//   Card,
//   FAB,
//   Chip,
//   TextInput,
//   Button,
//   Modal,
//   Portal,
//   RadioButton,
// } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import { colors, spacing, typography } from '../../constants/theme';
// import { useAuthStore } from '../../store/AuthStore';
// import NotificationService from '../../services/NotificationService';

// const BASE_URL = 'http://localhost:5000/api/announcements';

// export default function AnnouncementsScreen() {
//   const { authUser } = useAuthStore();
//   const token = authUser?.token;

//   const [announcements, setAnnouncements] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [form, setForm] = useState({
//     title: '',
//     content: '',
//     category: '',
//     announcementType: '',
//     targetMajor: '',
//     targetSubject: '',
//   });

//   const isAdminOrTeacher = ['admin', 'teacher'].includes(authUser?.role);
//   const categories = ['All', 'Academic', 'Services', 'Events', 'Emergency'];
//   const majors = ['Computer Science', 'Engineering', 'Business'];
//   const subjects = ['Math', 'Algorithms', 'Data Structures'];

//   useEffect(() => {
//     fetchAnnouncements();
//     NotificationService.initialzize(); // Register push token
//   }, []);

//   const fetchAnnouncements = async () => {
//     try {
//       const endpoint =
//         authUser?.role === 'student'
//           ? `${BASE_URL}/student`
//           : authUser?.role === 'teacher'
//           ? `${BASE_URL}/teacher`
//           : `${BASE_URL}/admin`;

//       const res = await fetch(endpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setAnnouncements(data.announcements || []);
//     } catch (err) {
//       console.error('Error fetching announcements:', err);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchAnnouncements();
//     setRefreshing(false);
//   };

//   const handleCreate = async () => {
//     const payload = {
//       ...form,
//       targetMajor:
//         form.announcementType === 'major' ? form.targetMajor : undefined,
//       targetSubject:
//         form.announcementType === 'subject' ? form.targetSubject : undefined,
//     };

//     try {
//       const res = await fetch(BASE_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();

//       if (data.success) {
//         setModalVisible(false);
//         setForm({
//           title: '',
//           content: '',
//           category: '',
//           announcementType: '',
//           targetMajor: '',
//           targetSubject: '',
//         });
//         fetchAnnouncements();
//       } else {
//         console.error('Creation error:', data.message);
//       }
//     } catch (err) {
//       console.error('Error creating announcement:', err);
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high':
//         return colors.error;
//       case 'medium':
//         return colors.warning;
//       case 'low':
//         return colors.success;
//       default:
//         return colors.gray;
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const filteredAnnouncements = announcements?.filter(
//     (a) => selectedCategory === 'All' || a.category === selectedCategory
//   );

//   const renderAnnouncementItem = ({ item }) => (
//     <Card style={styles.announcementCard}>
//       <Card.Content style={styles.cardContent}>
//         <View style={styles.announcementHeader}>
//           <View style={styles.headerLeft}>
//             <Text style={styles.announcementTitle}>{item.title}</Text>
//             <View style={styles.metaInfo}>
//               <Text style={styles.authorText}>
//                 By {item.sender?.firstName || 'Admin'}
//               </Text>
//               <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
//             </View>
//           </View>
//           <View style={styles.headerRight}>
//             <View
//               style={[
//                 styles.priorityBadge,
//                 { backgroundColor: getPriorityColor(item.priority || 'low') },
//               ]}
//             >
//               <Text style={styles.priorityText}>
//                 {(item.priority || 'low').toUpperCase()}
//               </Text>
//             </View>
//           </View>
//         </View>
//         <Text style={styles.announcementContent}>{item.content}</Text>
//         <View style={styles.announcementFooter}>
//           <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
//             {item.category}
//           </Chip>
//         </View>
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Filter Chips */}
//       <View style={styles.filterContainer}>
//         <FlatList
//           data={categories}
//           horizontal
//           renderItem={({ item }) => (
//             <Chip
//               selected={selectedCategory === item}
//               onPress={() => setSelectedCategory(item)}
//               style={[
//                 styles.categoryFilterChip,
//                 selectedCategory === item && styles.selectedFilterChip,
//               ]}
//               textStyle={[
//                 styles.filterChipText,
//                 selectedCategory === item && styles.selectedFilterChipText,
//               ]}
//             >
//               {item}
//             </Chip>
//           )}
//           keyExtractor={(item) => item}
//           contentContainerStyle={styles.filterChipContainer}
//         />
//       </View>

//       {/* Announcement List */}
//       <FlatList
//         data={filteredAnnouncements}
//         renderItem={renderAnnouncementItem}
//         keyExtractor={(item) => item._id}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="megaphone-outline" size={64} color={colors.gray} />
//             <Text style={styles.emptyText}>No announcements found</Text>
//             <Text style={styles.emptySubtext}>Check back later for updates</Text>
//           </View>
//         }
//         contentContainerStyle={styles.listContent}
//       />

//       {/* FAB for Admin/Teacher */}
//       {isAdminOrTeacher && (
//         <FAB icon="plus" style={styles.fab} onPress={() => setModalVisible(true)} />
//       )}

//       {/* Create Announcement Modal */}
//       <Portal>
//         <Modal
//           visible={isModalVisible}
//           onDismiss={() => setModalVisible(false)}
//           contentContainerStyle={styles.modal}
//         >
//           <ScrollView>
//             <TextInput
//               label="Title"
//               value={form.title}
//               onChangeText={(text) => setForm({ ...form, title: text })}
//               style={styles.input}
//             />
//             <TextInput
//               label="Content"
//               value={form.content}
//               onChangeText={(text) => setForm({ ...form, content: text })}
//               multiline
//               style={styles.input}
//             />
//             <TextInput
//               label="Category"
//               value={form.category}
//               onChangeText={(text) => setForm({ ...form, category: text })}
//               style={styles.input}
//             />

//             <Text style={styles.label}>Type</Text>
//             <RadioButton.Group
//               onValueChange={(val) =>
//                 setForm({ ...form, announcementType: val })
//               }
//               value={form.announcementType}
//             >
//               <RadioButton.Item label="General" value="general" />
//               <RadioButton.Item label="Major" value="major" />
//               <RadioButton.Item label="Subject" value="subject" />
//             </RadioButton.Group>

//             {form.announcementType === 'major' && (
//               <TextInput
//                 label="Target Major"
//                 value={form.targetMajor}
//                 onChangeText={(text) =>
//                   setForm({ ...form, targetMajor: text })
//                 }
//                 style={styles.input}
//               />
//             )}

//             {form.announcementType === 'subject' && (
//               <TextInput
//                 label="Target Subject"
//                 value={form.targetSubject}
//                 onChangeText={(text) =>
//                   setForm({ ...form, targetSubject: text })
//                 }
//                 style={styles.input}
//               />
//             )}

//             <Button
//               mode="contained"
//               onPress={handleCreate}
//               style={{ marginTop: spacing.md }}
//             >
//               Submit
//             </Button>
//           </ScrollView>
//         </Modal>
//       </Portal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.background },
//   filterContainer: { backgroundColor: colors.white, paddingVertical: spacing.md, elevation: 2 },
//   filterChipContainer: { paddingHorizontal: spacing.md },
//   categoryFilterChip: { marginRight: spacing.sm, backgroundColor: colors.lightGray },
//   selectedFilterChip: { backgroundColor: colors.primary },
//   filterChipText: { color: colors.text },
//   selectedFilterChipText: { color: colors.white },
//   listContent: { padding: spacing.md },
//   announcementCard: { marginBottom: spacing.md, elevation: 2 },
//   cardContent: { padding: spacing.md },
//   announcementHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
//   headerLeft: { flex: 1 },
//   headerRight: { marginLeft: spacing.md },
//   announcementTitle: { ...typography.h6, color: colors.text, marginBottom: spacing.xs },
//   metaInfo: { flexDirection: 'row', alignItems: 'center' },
//   authorText: { ...typography.caption, color: colors.primary, marginRight: spacing.md },
//   dateText: { ...typography.caption, color: colors.textSecondary },
//   priorityBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 12 },
//   priorityText: { ...typography.caption, color: colors.white, fontWeight: 'bold' },
//   announcementContent: { ...typography.body1, color: colors.text, marginBottom: spacing.md, lineHeight: 22 },
//   announcementFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
//   categoryChip: { backgroundColor: colors.lightGray },
//   categoryText: { ...typography.caption, color: colors.textSecondary },
//   emptyContainer: { alignItems: 'center', paddingVertical: spacing.xxl },
//   emptyText: { ...typography.h6, color: colors.textSecondary, marginTop: spacing.md },
//   emptySubtext: { ...typography.body2, color: colors.gray, marginTop: spacing.xs },
//   fab: { position: 'absolute', margin: spacing.md, right: 0, bottom: 0, backgroundColor: colors.primary },
//   modal: { backgroundColor: 'white', padding: spacing.lg, margin: spacing.md, borderRadius: 12 },
//   input: { marginBottom: spacing.md },
//   label: { ...typography.subtitle2, color: colors.text, marginTop: spacing.md },
// });
//
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  Card,
  FAB,
  Chip,
  TextInput,
  Button,
  Modal,
  Portal,
  RadioButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuthStore } from '../../store/AuthStore';
import { Dimensions } from 'react-native';
import Constants from 'expo-constants';
const screenHeight = Dimensions.get('window').height;
export default function AnnouncementsScreen() {
  const { authUser } = useAuthStore();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    announcementType: '',
    targetMajor: '',
    targetSubject: '',
  });

  const categories = ['Exam', 'Makeup Session', 'Event', 'Other'];
  const majors = ['Computer Science', 'Engineering', 'Business'];
  const subjects = ['Math', 'Algorithms', 'Data Structures'];

  const isAdminOrTeacher = ['admin', 'teacher'].includes(authUser?.role);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const url =
        authUser.role === 'student'
          ? `${Constants.expoConfig.extra.API_BASE_URL}/announcements/student`
          : authUser.role === 'teacher'
          ? `${Constants.expoConfig.extra.API_BASE_URL}/announcements/teacher`
          : `${Constants.expoConfig.extra.API_BASE_URL}/announcements/admin`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAnnouncements();
    setRefreshing(false);
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...form,
        targetMajor:
          form.announcementType === 'major' ? form.targetMajor : undefined,
        targetSubject:
          form.announcementType === 'subject' ? form.targetSubject : undefined,
      };

      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser?.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setForm({
          title: '',
          content: '',
          category: '',
          announcementType: '',
          targetMajor: '',
          targetSubject: '',
        });
        setModalVisible(false);
        fetchAnnouncements();
      } else {
        console.warn('Error:', data.message);
      }
    } catch (error) {
      console.error('Create announcement error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredAnnouncements = announcements?.filter(
    (a) => selectedCategory === 'All' || a.category === selectedCategory
  );

  const renderAnnouncementItem = ({ item }) => (
    <Card style={styles.announcementCard}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.announcementTitle}>{item.title}</Text>
          <Text style={styles.meta}>
            By {item?.sender?.firstName} {item?.sender?.lastName} ·{' '}
            {formatDate(item.createdAt)}
          </Text>
        </View>
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.footer}>
          <Chip>{item.category}</Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Filter */}
      <FlatList
        data={['All', ...categories]}
        horizontal
        showsHorizontalScrollIndicator={true}
        renderItem={({ item }) => (
          <Chip
            style={[
              styles.filterChip,
              selectedCategory === item && styles.selectedChip,
            ]}
            textStyle={[
              styles.filterText,
              selectedCategory === item && styles.selectedText,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            {item}
          </Chip>
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={{ padding: spacing.md }}
      />

      {/* Announcements List */}
      <FlatList
        data={filteredAnnouncements}
        renderItem={renderAnnouncementItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: spacing.md }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
            <Ionicons name="megaphone-outline" size={48} color={colors.gray} />
            <Text style={{ color: colors.gray, marginTop: 10 }}>
              No announcements
            </Text>
          </View>
        }
      />

      {/* Create Button */}
      {isAdminOrTeacher && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />
      )}

      {/* Modal */}
      ;

<Portal>
  <Modal
    visible={isModalVisible}
    onDismiss={() => setModalVisible(false)}
    contentContainerStyle={styles.modal}
  >
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      style={{ maxHeight: screenHeight * 0.8 }} // constrain modal height to allow scroll
      showsVerticalScrollIndicator={true}
    >
      <TextInput
        label="Title"
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
        style={styles.input}
      />
      <TextInput
        label="Content"
        value={form.content}
        onChangeText={(text) => setForm({ ...form, content: text })}
        multiline
        style={styles.input}
      />

      {/* Category */}
      <Text style={styles.label}>Category</Text>
      <RadioButton.Group
        onValueChange={(val) => setForm({ ...form, category: val })}
        value={form.category}
      >
        {categories.map((cat) => (
          <RadioButton.Item key={cat} label={cat} value={cat} />
        ))}
      </RadioButton.Group>

      {/* Type */}
      <Text style={styles.label}>Type</Text>
      <RadioButton.Group
        onValueChange={(val) =>
          setForm({
            ...form,
            announcementType: val,
            targetMajor: '',
            targetSubject: '',
          })
        }
        value={form.announcementType}
      >
        <RadioButton.Item label="Major" value="major" />
        <RadioButton.Item label="Subject" value="subject" />
      </RadioButton.Group>

      {/* TargetMajor or TargetSubject */}
      {form.announcementType === 'major' && (
        <>
          <Text style={styles.label}>Target Major</Text>
          <RadioButton.Group
            onValueChange={(val) => setForm({ ...form, targetMajor: val })}
            value={form.targetMajor}
          >
            {majors.map((major) => (
              <RadioButton.Item key={major} label={major} value={major} />
            ))}
          </RadioButton.Group>
        </>
      )}

      {form.announcementType === 'subject' && (
        <>
          <Text style={styles.label}>Target Subject</Text>
          <RadioButton.Group
            onValueChange={(val) => setForm({ ...form, targetSubject: val })}
            value={form.targetSubject}
          >
            {subjects.map((sub) => (
              <RadioButton.Item key={sub} label={sub} value={sub} />
            ))}
          </RadioButton.Group>
        </>
      )}

      <Button mode="contained" onPress={handleCreate} style={{ marginTop: 10 }}>
        Submit
      </Button>
    </ScrollView>
  </Modal>
</Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterChip: {
    marginRight: spacing.sm,
    backgroundColor: colors.lightGray,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  filterText: { color: colors.text },
  selectedText: { color: colors.white },
  announcementCard: {
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.sm,
  },
  announcementTitle: {
    ...typography.h6,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  content: {
    ...typography.body1,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: colors.primary,
  },
  modal: {
    backgroundColor: 'white',
    padding: spacing.lg,
    margin: spacing.md,
    borderRadius: 12,
  },
  input: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.subtitle2,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
});
