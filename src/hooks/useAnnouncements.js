// import { useEffect, useState } from 'react';
// import Toast from 'react-native-toast-message';
// import { useAuthStore } from '../store/AuthStore';

// export const useAnnouncements = () => {
//   const [loading, setLoading] = useState(false);
//   const [announcements, setAnnouncements] = useState([]);

//   const token = useAuthStore((state) => state.authUser?.token);

//   useEffect(() => {
//     fetchAnnouncements();
//   }, [token]);

//   const fetchAnnouncements = async () => {
//     if (!token) return;

//     setLoading(true);
//     try {
//       const res = await fetch('http://127.0.0.1:5000/api/announcements', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }
//       setAnnouncements(data);
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createAnnouncement = async (announcementData) => {
//     if (!token) return;

//     try {
//       const res = await fetch('http://127.0.0.1:5000/api/announcements', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(announcementData),
//       });
//       const data = await res.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }
//       setAnnouncements(prev => [...prev, data]);
//       Toast.show({
//         type: 'success',
//         text1: 'Success',
//         text2: 'Announcement created successfully',
//       });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: error.message,
//       });
//     }
//   };

//   const updateAnnouncement = async (announcementId, announcementData) => {
//     if (!token) return;

//     try {
//       const res = await fetch(`http://127.0.0.1:5000/api/announcements/${announcementId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(announcementData),
//       });
//       const data = await res.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }
//       setAnnouncements(prev => prev.map(announcement => announcement._id === announcementId ? data : announcement));
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: error.message,
//       });
//     }
//   };

//   const deleteAnnouncement = async (announcementId) => {
//     if (!token) return;

//     try {
//       const res = await fetch(`http://127.0.0.1:5000/api/announcements/${announcementId}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) {
//         throw new Error('Failed to delete announcement');
//       }
//       setAnnouncements(prev => prev.filter(announcement => announcement._id !== announcementId));
//       Toast.show({
//         type: 'success',
//         text1: 'Success',
//         text2: 'Announcement deleted successfully',
//       });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: error.message,
//       });
//     }
//   };

//   return { 
//     loading, 
//     announcements, 
//     fetchAnnouncements, 
//     createAnnouncement, 
//     updateAnnouncement, 
//     deleteAnnouncement 
//   };
// };

import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/AuthStore';
import Constants from 'expo-constants';
export const useAnnouncements = () => {
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const authUser = useAuthStore((state) => state.authUser);
  const token = authUser?.token;
  const role = authUser?.role;

  useEffect(() => {
    if (token && role) fetchAnnouncements();
  }, [token, role]);

  const getFetchRoute = () => {
    switch (role) {
      case 'student':
        return '/api/announcements/student';
      case 'teacher':
        return '/api/announcements/teacher';
      case 'admin':
        return '/api/announcements/admin';
      default:
        return null;
    }
  };

 const fetchAnnouncements = async () => {
  const route = getFetchRoute();
  if (!token || !route) return;

  setLoading(true);
  try {
    const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}${route}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to fetch announcements');
    }

    setAnnouncements(Array.isArray(data) ? data : []); // ✅ Ensure it's always an array
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Fetch Error',
      text2: error.message,
    });
    setAnnouncements([]); // fallback to empty array on error
  } finally {
    setLoading(false);
  }
};


  const createAnnouncement = async (announcementData) => {
    if (!token) return;

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(announcementData),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to create announcement');
      }

      setAnnouncements((prev) => [...prev, data]);

      Toast.show({
        type: 'success',
        text1: 'Created',
        text2: 'Announcement created successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Create Error',
        text2: error.message,
      });
    }
  };

  const updateAnnouncement = async (announcementId, announcementData) => {
    if (!token) return;

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/announcements/${announcementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(announcementData),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to update announcement');
      }

      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === announcementId ? data : announcement
        )
      );

      Toast.show({
        type: 'success',
        text1: 'Updated',
        text2: 'Announcement updated successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Error',
        text2: error.message,
      });
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    if (!token) return;

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/announcements/${announcementId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete announcement');
      }

      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement._id !== announcementId)
      );

      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Announcement deleted successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Delete Error',
        text2: error.message,
      });
    }
  };

  return {
    loading,
    announcements,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
};
