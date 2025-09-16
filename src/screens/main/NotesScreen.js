// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   RefreshControl,
// } from 'react-native';
// import {
//   Card,
//   Title,
//   Paragraph,
//   Button,
//   FAB,
//   Portal,
//   Modal,
//   TextInput,
//   Chip,
//   Searchbar,
// } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import { useNotes } from '../../hooks/useNotes';

// const NotesScreen = () => {
//   const {
//     notes,
//     loading,
//     fetchNotes,
//     createNote,
//     updateNote,
//     deleteNote,
//   } = useNotes();

//   const [refreshing, setRefreshing] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingNote, setEditingNote] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [newNote, setNewNote] = useState({
//     title: '',
//     content: '',
//     color: 'default',
//   });

//   const categories = ['default', 'study', 'work', 'personal', 'ideas', 'reminders', 'projects'];

//   const categoryColors = {
//     default: '#2196F3',
//     study: '#4CAF50',
//     work: '#FF9800',
//     personal: '#9C27B0',
//     ideas: '#FFEB3B',
//     reminders: '#F44336',
//     projects: '#00BCD4',
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchNotes();
//     setRefreshing(false);
//   };

//   const filteredNotes = (notes || []).filter((note) => {
//     const title = note.title?.toLowerCase() || '';
//     const content = note.content?.toLowerCase() || '';
//     const query = searchQuery?.toLowerCase() || '';
//     return title.includes(query) || content.includes(query);
//   });

//   const handleCreateOrUpdate = async () => {
//     if (!newNote.title.trim() || !newNote.content.trim()) {
//       Alert.alert('Error', 'Please fill in both title and content');
//       return;
//     }

//     try {
//       if (editingNote) {
//         await updateNote(editingNote._id, newNote);
//       } else {
//         await createNote(newNote);
//       }
//       setModalVisible(false);
//       setEditingNote(null);
//       setNewNote({ title: '', content: '', color: 'default' });
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong');
//     }
//   };

//   const handleEditNote = (note) => {
//     setEditingNote(note);
//     setNewNote({
//       title: note.title,
//       content: note.content,
//       color: note.color || 'default',
//     });
//     setModalVisible(true);
//   };

//   const handleDeleteNote = (noteId) => {
//   Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
//     { text: 'Cancel', style: 'cancel' },
//     {
//       text: 'Delete',
//       style: 'destructive',
//       onPress: () => {
//         console.log('Deleting note with ID:', noteId);
//         // Wrap async call inside a normal function
//         deleteNote(noteId).catch((error) => {
//           Alert.alert('Error', 'Failed to delete note');
//           console.error(error);
//         });
//       },
//     },
//   ]);
// };


//   const renderNote = ({ item }) => (
//     <Card style={styles.noteCard}>
//       <Card.Content>
//         <View style={styles.noteHeader}>
//           <View style={styles.noteTitleContainer}>
//             <Title style={styles.noteTitle}>{item.title}</Title>
//             <Chip
//               mode="outlined"
//               style={[
//                 styles.categoryChip,
//                 { backgroundColor: categoryColors[item.color] + '20' },
//               ]}
//               textStyle={{ color: categoryColors[item.color] }}
//             >
//               {item.color}
//             </Chip>
//           </View>
//           <View style={styles.noteActions}>
//             <TouchableOpacity onPress={() => handleEditNote(item)} style={styles.actionButton}>
//               <Ionicons name="pencil-outline" size={20} color="#1976d2" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleDeleteNote(item._id)} style={styles.actionButton}>
//               <Ionicons name="trash-outline" size={20} color="#d32f2f" />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <Paragraph style={styles.noteContent} numberOfLines={4}>
//           {item.content}
//         </Paragraph>
//         <View style={styles.noteFooter}>
//           <Text style={styles.noteDate}>
//             {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
//           </Text>
//           <Text style={styles.wordCount}>{item.content?.split(' ').length || 0} words</Text>
//         </View>
//       </Card.Content>
//     </Card>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Searchbar
//           placeholder="Search notes..."
//           onChangeText={setSearchQuery}
//           value={searchQuery}
//           style={styles.searchBar}
//           clearIcon="close"
//         />
//       </View>

//       <FlatList
//         data={filteredNotes}
//         renderItem={renderNote}
//         keyExtractor={(item) => item._id?.toString()}
//         contentContainerStyle={styles.listContainer}
//         refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} />}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="document-text-outline" size={64} color="#ccc" />
//             <Text style={styles.emptyText}>No notes found</Text>
//             <Text style={styles.emptySubtext}>Tap the + button to create your first note</Text>
//           </View>
//         }
//       />

//       <FAB
//         style={styles.fab}
//         icon="plus"
//         onPress={() => {
//           setEditingNote(null);
//           setNewNote({ title: '', content: '', color: 'default' });
//           setModalVisible(true);
//         }}
//       />

//       <Portal>
//         <Modal
//           visible={modalVisible}
//           onDismiss={() => {
//             setModalVisible(false);
//             setEditingNote(null);
//           }}
//           contentContainerStyle={styles.modalContainer}
//         >
//           <Title style={styles.modalTitle}>
//             {editingNote ? 'Edit Note' : 'Create New Note'}
//           </Title>

//           <TextInput
//             label="Title *"
//             value={newNote.title}
//             onChangeText={(text) => setNewNote({ ...newNote, title: text })}
//             style={styles.input}
//             mode="outlined"
//           />
//           <TextInput
//             label="Content *"
//             value={newNote.content}
//             onChangeText={(text) => setNewNote({ ...newNote, content: text })}
//             style={[styles.input, styles.contentInput]}
//             mode="outlined"
//             multiline
//             numberOfLines={8}
//           />

//           <View style={styles.categorySelector}>
//             <Text style={styles.selectorLabel}>Color Category:</Text>
//             <View style={styles.categoryGrid}>
//               {categories.map((color) => (
//                 <TouchableOpacity
//                   key={color}
//                   style={[
//                     styles.categoryButton,
//                     {
//                       backgroundColor:
//                         newNote.color === color ? categoryColors[color] : '#f0f0f0',
//                     },
//                   ]}
//                   onPress={() => setNewNote({ ...newNote, color })}
//                 >
//                   <Text
//                     style={[
//                       styles.categoryButtonText,
//                       {
//                         color: newNote.color === color ? '#fff' : '#666',
//                       },
//                     ]}
//                   >
//                     {color}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           <View style={styles.modalButtons}>
//             <Button
//               mode="outlined"
//               onPress={() => {
//                 setModalVisible(false);
//                 setEditingNote(null);
//               }}
//               style={styles.modalButton}
//             >
//               Cancel
//             </Button>
//             <Button mode="contained" onPress={handleCreateOrUpdate} style={styles.modalButton}>
//               {editingNote ? 'Update' : 'Create'}
//             </Button>
//           </View>
//         </Modal>
//       </Portal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   header: { padding: 16, backgroundColor: '#fff', elevation: 2 },
//   searchBar: { marginBottom: 0 },
//   listContainer: { padding: 16 },
//   noteCard: { marginBottom: 12, elevation: 2 },
//   noteHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
//   noteTitleContainer: { flex: 1, marginRight: 8 },
//   noteTitle: { fontSize: 18, marginBottom: 4 },
//   categoryChip: { alignSelf: 'flex-start', height: 28 },
//   noteActions: { flexDirection: 'row', gap: 8 },
//   actionButton: { padding: 4 },
//   noteContent: { marginBottom: 12, color: '#666', lineHeight: 20 },
//   noteFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   noteDate: { color: '#999', fontSize: 12 },
//   wordCount: { color: '#999', fontSize: 12 },
//   emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
//   emptyText: { marginTop: 16, fontSize: 16, color: '#999', fontWeight: '500' },
//   emptySubtext: { marginTop: 8, fontSize: 14, color: '#ccc', textAlign: 'center' },
//   fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#1976d2' },
//   modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 },
//   modalTitle: { textAlign: 'center', marginBottom: 20 },
//   input: { marginBottom: 12 },
//   contentInput: { height: 120 },
//   categorySelector: { marginBottom: 20 },
//   selectorLabel: { fontSize: 16, fontWeight: '500', marginBottom: 8, color: '#333' },
//   categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
//   categoryButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, marginBottom: 8 },
//   categoryButtonText: { fontSize: 12, fontWeight: '500' },
//   modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
//   modalButton: { flex: 1 },
// });

// export default NotesScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Portal,
  Modal,
  TextInput,
  Chip,
  Searchbar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../../hooks/useNotes';


const NotesScreen = () => {
  const {
    notes,
    loading,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    color: 'default',
  });
    // ["default", "red", "green", "blue", "yellow", "purple"]

  const categories = ['default',"red", "green", "blue", "yellow", "purple"];

  const categoryColors = {
    default: '#2196F3',
    red: '#F44336',
    green: '#4CAF50',
    blue: '#2196F3',
    yellow: '#FFEB3B',
    purple: '#9C27B0'
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  };

  const filteredNotes = (notes || []).filter((note) => {
    const title = note.title?.toLowerCase() || '';
    const content = note.content?.toLowerCase() || '';
    const query = searchQuery?.toLowerCase() || '';
    return title.includes(query) || content.includes(query);
  });

  const handleCreateOrUpdate = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    if (!categories.includes(newNote.color)) {
      Alert.alert('Error', 'Invalid color category selected.');
      return;
    }

    try {
      if (editingNote) {
        await updateNote(editingNote._id, newNote);
      } else {
        await createNote(newNote);
      }
      await onRefresh();
      setModalVisible(false);
      setEditingNote(null);
      setNewNote({ title: '', content: '', color: 'default' });
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      color: note.color || 'default',
    });
    setModalVisible(true);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      await onRefresh();
    } catch (error) {
      console.error('Failed to delete note:', error);
      Alert.alert('Error', 'Failed to delete the note.');
    }
  };

  const renderNote = ({ item }) => (
    <Card style={styles.noteCard}>
      <Card.Content>
        <View style={styles.noteHeader}>
          <View style={styles.noteTitleContainer}>
            <Title style={styles.noteTitle}>{item.title}</Title>
            <Chip
              mode="outlined"
              style={[
                styles.categoryChip,
               { backgroundColor: (categoryColors[item.color] || categoryColors['default']) + '20' }
,
              ]}
              textStyle={{ color: categoryColors[item.color] }}
            >
              {item.color}
            </Chip>
          </View>
          <View style={styles.noteActions}>
            <TouchableOpacity onPress={() => handleEditNote(item)} style={styles.actionButton}>
              <Ionicons name="pencil-outline" size={20} color="#1976d2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteNote(item._id)} style={styles.actionButton}>
              <Ionicons name="trash-outline" size={20} color="#d32f2f" />
            </TouchableOpacity>
          </View>
        </View>
        <Paragraph style={styles.noteContent} numberOfLines={4}>
          {item.content}
        </Paragraph>
        <View style={styles.noteFooter}>
          <Text style={styles.noteDate}>
            {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.wordCount}>{item.content?.split(' ').length || 0} words</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search notes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          clearIcon="close"
        />
      </View>

      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item, index) => item._id?.toString() || index.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notes found</Text>
            <Text style={styles.emptySubtext}>Tap the + button to create your first note</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          setEditingNote(null);
          setNewNote({ title: '', content: '', color: 'default' });
          setModalVisible(true);
        }}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setEditingNote(null);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>
            {editingNote ? 'Edit Note' : 'Create New Note'}
          </Title>

          <TextInput
            label="Title *"
            value={newNote.title}
            onChangeText={(text) => setNewNote({ ...newNote, title: text })}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Content *"
            value={newNote.content}
            onChangeText={(text) => setNewNote({ ...newNote, content: text })}
            style={[styles.input, styles.contentInput]}
            mode="outlined"
            multiline
            numberOfLines={8}
          />

          <View style={styles.categorySelector}>
            <Text style={styles.selectorLabel}>Color Category:</Text>
            <View style={styles.categoryGrid}>
              {categories.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor:
                        newNote.color === color ? categoryColors[color] : '#f0f0f0',
                    },
                  ]}
                  onPress={() => setNewNote({ ...newNote, color })}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      {
                        color: newNote.color === color ? '#fff' : '#666',
                      },
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setModalVisible(false);
                setEditingNote(null);
              }}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button mode="contained" onPress={handleCreateOrUpdate} style={styles.modalButton}>
              {editingNote ? 'Update' : 'Create'}
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: '#fff', elevation: 2 },
  searchBar: { marginBottom: 0 },
  listContainer: { padding: 16 },
  noteCard: { marginBottom: 12, elevation: 2 },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  noteTitleContainer: { flex: 1, marginRight: 8 },
  noteTitle: { fontSize: 18, marginBottom: 4 },
  categoryChip: { alignSelf: 'flex-start', height: 28 },
  noteActions: { flexDirection: 'row', gap: 8 },
  actionButton: { padding: 4 },
  noteContent: { marginBottom: 12, color: '#666', lineHeight: 20 },
  noteFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  noteDate: { color: '#999', fontSize: 12 },
  wordCount: { color: '#999', fontSize: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#999', fontWeight: '500' },
  emptySubtext: { marginTop: 8, fontSize: 14, color: '#ccc', textAlign: 'center' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#1976d2' },
  modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 },
  modalTitle: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 12 },
  contentInput: { height: 120 },
  categorySelector: { marginBottom: 20 },
  selectorLabel: { fontSize: 16, fontWeight: '500', marginBottom: 8, color: '#333' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, marginBottom: 8 },
  categoryButtonText: { fontSize: 12, fontWeight: '500' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  modalButton: { flex: 1 },
});

export default NotesScreen;
