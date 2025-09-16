// import { useEffect, useState } from 'react';
// import Toast from 'react-native-toast-message';
// import { useAuthStore } from '../store/AuthStore';

// export const useNotes = () => {
//   const [loading, setLoading] = useState(false);
//   const [notes, setNotes] = useState([]);

//   const token = useAuthStore((state) => state.authUser?.token);

//   useEffect(() => {
//     fetchNotes();
//   }, [token]);

//   const fetchNotes = async () => {
//     if (!token) return;

//     setLoading(true);
//     try {
//       const res = await fetch('http://127.0.0.1:5000/api/notes', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       console.log('Fetched notes:', data);

//       if (data.error) {
//         throw new Error(data.error);
//       }

//       setNotes(Array.isArray(data.notes) ? data.notes : []);
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error fetching notes',
//         text2: error.message,
//       });
//       setNotes([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createNote = async (noteData) => {
//     if (!token) return;

//     try {
//       const res = await fetch('http://127.0.0.1:5000/api/notes', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(noteData),
//       });

//       const data = await res.json();
//       console.log('Create note response:', data);

//       if (data.error) throw new Error(data.error);

//       setNotes((prev) => [...prev, data]);

//       Toast.show({
//         type: 'success',
//         text1: 'Note created successfully',
//       });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error creating note',
//         text2: error.message,
//       });
//     }
//   };


//   const updateNote = async (noteId, updatedData) => {
//   if (!token) throw new Error('No token');

//   // Validate color locally to avoid backend errors
//   const allowedColors = ['default', 'study', 'work', 'personal', 'ideas', 'reminders', 'projects'];
//   if (!allowedColors.includes(updatedData.color)) {
//     throw new Error('Invalid color value.');
//   }

//   console.log('Updating note:', noteId, 'with data:', updatedData);

//   const response = await fetch(`http://127.0.0.1:5000/api/notes/${noteId}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(updatedData),
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => null);
//     console.error('Update response:', response.status, errorData);
//     throw new Error(errorData?.message || 'Failed to update note');
//   }

//   const data = await response.json();
//   // Update local state etc.
//   return data;
// };



// const deleteNote = async (noteId) => {
//   if (!token) return;

//   try {
//     const res = await fetch(`http://127.0.0.1:5000/api/notes/${noteId}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.error || 'Failed to delete note');
//     }

//     // Remove note locally
//     setNotes((prev) => prev.filter((note) => note._id !== noteId));
//   } catch (error) {
//     throw error;
//   }
// };



//   return {
//     loading,
//     notes,
//     fetchNotes,
//     createNote,
//     updateNote,
//     deleteNote,
//   };
// };
// Updated useNotes.js hook
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/AuthStore';
import {NotesScreen} from '../screens/main/NotesScreen';
import Constants from 'expo-constants';
export const useNotes = () => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);

  const token = useAuthStore((state) => state.authUser?.token);

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log('Fetched notes:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      setNotes(Array.isArray(data.notes) ? data.notes : []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching notes',
        text2: error.message,
      });
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // const createNote = async (noteData) => {
  //   if (!token) return;

  //   try {
  //     const res = await fetch(`${process.env.API_BASE_URL}/notes`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(noteData),
  //     });

  //     const data = await res.json();
  //     if (data.error) throw new Error(data.error);

  //     // Optimistically add note to local state
  //     setNotes((prev) => [...prev, data]);

  //     Toast.show({
  //       type: 'success',
  //       text1: 'Note created successfully',
  //     });
  //     NotesScreen.onRefresh(); // Call onRefresh to update the list
  //   } catch (error) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error creating note',
  //       text2: error.message,
  //     });
  //   }
  // };
const createNote = async (noteData) => {
  if (!token) return;

  try {
    const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    // Optimistically add note to local state
    setNotes((prev) => [...prev, data]);

    Toast.show({
      type: 'success',
      text1: 'Note created successfully',
    });

    return data; // Let the screen decide what to do next
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error creating note',
      text2: error.message,
    });
    throw error;
  }
};

  const updateNote = async (noteId, updatedData) => {
    if (!token) throw new Error('No token');

    const allowedColors = ['default', 'study', 'work', 'personal', 'ideas', 'reminders', 'projects'];
    if (!allowedColors.includes(updatedData.color)) {
      throw new Error('Invalid color value.');
    }

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.message || data.error || 'Failed to update note');
      }

      // Optimistically update local state
      setNotes((prev) =>
        prev.map((note) => (note._id === noteId ? { ...note, ...data } : note))
      );

      Toast.show({
        type: 'success',
        text1: 'Note updated successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating note',
        text2: error.message,
      });
      throw error;
    }
  };

  const deleteNote = async (noteId) => {
    if (!token) return;

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete note');
      }

      // Remove note from local state
      setNotes((prev) => prev.filter((note) => note._id !== noteId));

      Toast.show({
        type: 'success',
        text1: 'Note deleted',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Delete failed',
        text2: error.message,
      });
      throw error;
    }
  };

  return {
    loading,
    notes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
};
