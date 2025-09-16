// // import { useEffect, useState } from 'react';
// // import Toast from 'react-native-toast-message';
// // import { useAuthStore } from '../store/AuthStore';

// // export const useLostAndFound = () => {
// //   const [loading, setLoading] = useState(false);
// //   const [items, setItems] = useState([]);

// //   const token = useAuthStore((state) => state.authUser?.token);

// //   useEffect(() => {
// //     fetchItems();
// //   }, [token]);

// //  const fetchItems = async () => {
// //   if (!token) return;

// //   setLoading(true);
// //   try {
// //     const res = await fetch('http://127.0.0.1:5000/api/lost-and-found', {
// //       method: 'GET',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         Authorization: `Bearer ${token}`,
// //       },
// //     });
// //     const data = await res.json();
// //     if (data.error) {
// //       throw new Error(data.error);
// //     }
// //     setItems(data.items || []); // ✅ defensive check
// //   } catch (error) {
// //     Toast.show({
// //       type: 'error',
// //       text1: 'Error',
// //       text2: error.message,
// //     });
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   const createItem = async (itemData) => {
// //     if (!token) return;

// //     try {
// //       const res = await fetch('http://127.0.0.1:5000/api/lost-and-found', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(itemData),
// //       });
// //       const data = await res.json();
// //       if (data.error) {
// //         throw new Error(data.error);
// //       }
// //       setItems(prev => [...prev, data]);
// //       Toast.show({
// //         type: 'success',
// //         text1: 'Success',
// //         text2: 'Item posted successfully',
// //       });
// //     } catch (error) {
// //       Toast.show({
// //         type: 'error',
// //         text1: 'Error',
// //         text2: error.message,
// //       });
// //     }
// //   };

// //   const updateItem = async (itemId, itemData) => {
// //     if (!token) return;

// //     try {
// //       const res = await fetch(`http://127.0.0.1:5000/api/lost-and-found/${itemId}`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(itemData),
// //       });
// //       const data = await res.json();
// //       if (data.error) {
// //         throw new Error(data.error);
// //       }
// //       setItems(prev => prev.map(item => item._id === itemId ? data : item));
// //     } catch (error) {
// //       Toast.show({
// //         type: 'error',
// //         text1: 'Error',
// //         text2: error.message,
// //       });
// //     }
// //   };

// //   const deleteItem = async (itemId) => {
// //     if (!token) return;

// //     try {
// //       const res = await fetch(`http://127.0.0.1:5000/api/lost-and-found/${itemId}`, {
// //         method: 'DELETE',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       if (!res.ok) {
// //         throw new Error('Failed to delete item');
// //       }
// //       setItems(prev => prev.filter(item => item._id !== itemId));
// //       Toast.show({
// //         type: 'success',
// //         text1: 'Success',
// //         text2: 'Item deleted successfully',
// //       });
// //     } catch (error) {
// //       Toast.show({
// //         type: 'error',
// //         text1: 'Error',
// //         text2: error.message,
// //       });
// //     }
// //   };

// //   return { 
// //     loading, 
// //     items, 
// //     fetchItems, 
// //     createItem, 
// //     updateItem, 
// //     deleteItem 
// //   };
// // };

// import { useEffect, useState } from 'react';
// import Toast from 'react-native-toast-message';
// import { useAuthStore } from '../store/AuthStore';

// // Replace with your IP if testing on device
// const BASE_URL = 'http://127.0.0.1:5000/api/lost-and-found';

// export const useLostAndFound = () => {
//   const [loading, setLoading] = useState(false);
//   const [items, setItems] = useState([]);

//   const token = useAuthStore((state) => state.authUser?.token);

//   // ✅ Fetch All Items
//   const fetchItems = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await fetch(BASE_URL, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to fetch items');
//       setItems(data);
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Fetch Error',
//         text2: error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, [token]);

//   // ✅ Create Item with Image
// const createItem = async (itemData) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("title", itemData.title);
//       formData.append("description", itemData.description);
//       formData.append("type", itemData.type);
//       formData.append("location", itemData.location);
//       formData.append("phoneNumber", itemData.phoneNumber); // ✅ Correct field
//       formData.append("category", itemData.category);

//       // Optional image
//       if (itemData.image) {
//         formData.append("image", {
//           uri: itemData.image.uri,
//           name: itemData.image.name || "photo.jpg",
//           type: itemData.image.type || "image/jpeg",
//         });
//       }

//       const res = await fetch("http://127.0.0.1:5000/api/lost-and-found", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//         body: formData,
//       });

//       const result = await res.json();

//       if (!res.ok) throw new Error(result.message || "Failed to create item");
//     } catch (err) {
//       console.error("Create Item Error:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Delete Item
//   const deleteItem = async (itemId) => {
//     if (!token) return;

//     try {
//       const res = await fetch(`${BASE_URL}/${itemId}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Delete failed');

//       setItems((prev) => prev.filter((item) => item._id !== itemId));
//       Toast.show({
//         type: 'success',
//         text1: 'Deleted',
//         text2: 'Item deleted successfully',
//       });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Delete Error',
//         text2: error.message,
//       });
//     }
//   };

//   // ✅ Toggle Resolved Status
//   const updateResolvedStatus = async (itemId, resolved) => {
//     if (!token) return;

//     try {
//       const res = await fetch(`${BASE_URL}/${itemId}/resolve`, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to update status');

//       setItems((prev) =>
//         prev.map((item) =>
//           item._id === itemId ? { ...item, resolved: !item.resolved } : item
//         )
//       );

//       Toast.show({
//         type: 'success',
//         text1: resolved ? 'Unresolved' : 'Resolved',
//         text2: resolved
//           ? 'Item marked as unresolved'
//           : 'Item marked as resolved',
//       });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Status Update Error',
//         text2: error.message,
//       });
//     }
//   };

//   // ✅ Notify Poster
//   const sendNotification = async (itemId, message) => {
//     if (!token) return;

//     try {
//       const res = await fetch(`${BASE_URL}/${itemId}/notify`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Notification failed');

//       Toast.show({
//         type: 'success',
//         text1: 'Notified',
//         text2: 'Poster has been notified.',
//       });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Notify Error',
//         text2: error.message,
//       });
//     }
//   };

//   return {
//     loading,
//     items,
//     fetchItems,
//     createItem,
//     deleteItem,
//     updateResolvedStatus,
//     sendNotification,
//   };
// };

// import { useEffect, useState } from 'react';
// import Toast from 'react-native-toast-message';
// import { useAuthStore } from '../store/AuthStore';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import Constants from 'expo-constants';
// const BASE_URL = `${Constants.expoConfig.extra.API_BASE_URL}/lost-and-found`;

// export const useLostAndFound = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const token = useAuthStore((state) => state.authUser?.token);

//   // Fetch items on mount
//   useEffect(() => {
//     if (token) {
//       fetchItems();
//     }
//   }, [token]);

//   // Fetch all items
//   const fetchItems = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(BASE_URL, {
//         headers: {
//           Authorization: `Bearer ${token}`,

//         },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setItems(data.items || []);
//       } else {
//         Toast.show({ type: 'error', text1: data.message || 'Failed to fetch items' });
//       }
//     } catch (err) {
//       Toast.show({ type: 'error', text1: 'Something went wrong' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create a new item
// const createItem = async (itemData) => {
//   setLoading(true);
//   try {
//     const formData = new FormData();

//     formData.append('title', itemData.title);
//     formData.append('description', itemData.description);
//     formData.append('category', itemData.category);
//     formData.append('location', itemData.location);
//     formData.append('phoneNumber', itemData.phoneNumber);
//     formData.append('type', itemData.type);

//     if (itemData.image?.uri?.startsWith('data:image')) {
//       const blob = await (await fetch(itemData.image.uri)).blob();
//       formData.append('image', {
//         uri: itemData.image.uri,
//         name: 'photo.jpg',
//         type: blob.type,
//       });
//     }
//     // console.log('Creating item with data:', {
//     //   title: itemData.title,
//     //   description: itemData.description,
//     //   category: itemData.category,
//     //   location: itemData.location,
//     //   phoneNumber: itemData.phoneNumber,
//     //   type: itemData.type,
//     //   image: itemData.image ? itemData.image.uri : 'No image',
//     // });

//     const res = await axios.post(BASE_URL, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     if (res.status === 201 || res.status === 200) {
//       Toast.show({ type: 'success', text1: 'Item posted successfully' });
//       fetchItems();
//     } else {
//       Toast.show({ type: 'error', text1: res.data?.message || 'Failed to post item' });
//     }
//   } catch (err) {
//     console.log('Upload Error:', err);
//     Toast.show({ type: 'error', text1: err.response?.data?.message || 'Error creating item' });
//   } finally {
//     setLoading(false);
//   }
// };




//   // Delete an item
//   const deleteItem = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.delete(`${BASE_URL}/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (res.status === 200) {
//         Toast.show({ type: 'success', text1: 'Item deleted successfully' });
//         fetchItems();
//       } else {
//         Toast.show({ type: 'error', text1: res.data?.message || 'Delete failed' });
//       }
//     } catch (err) {
//       Toast.show({ type: 'error', text1: err.response?.data?.message || 'Error deleting item' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     items,
//     loading,
//     fetchItems,
//     createItem,
//     deleteItem,
//   };
// };





import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/AuthStore';
import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = `${Constants.expoConfig.extra.API_BASE_URL}/lost-and-found`;

export const useLostAndFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.authUser?.token);

  // Fetch items on mount or token change
  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token]);

  // Fetch all items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      } else {
        Toast.show({ type: 'error', text1: data.message || 'Failed to fetch items' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  // Create a new item
  const createItem = async (itemData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('title', itemData.title);
      formData.append('description', itemData.description);
      formData.append('category', itemData.category);
      formData.append('location', itemData.location);
      formData.append('phoneNumber', itemData.phoneNumber);
      formData.append('type', itemData.type);

      if (itemData.image?.uri?.startsWith('data:image')) {
        const blob = await (await fetch(itemData.image.uri)).blob();
        formData.append('image', {
          uri: itemData.image.uri,
          name: 'photo.jpg',
          type: blob.type,
        });
      }

      const res = await axios.post(BASE_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201 || res.status === 200) {
        Toast.show({ type: 'success', text1: 'Item posted successfully' });
        fetchItems();
      } else {
        Toast.show({ type: 'error', text1: res.data?.message || 'Failed to post item' });
      }
    } catch (err) {
      console.log('Upload Error:', err);
      Toast.show({ type: 'error', text1: err.response?.data?.message || 'Error creating item' });
    } finally {
      setLoading(false);
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        Toast.show({ type: 'success', text1: 'Item deleted successfully' });
        fetchItems();
      } else {
        Toast.show({ type: 'error', text1: res.data?.message || 'Delete failed' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: err.response?.data?.message || 'Error deleting item' });
    } finally {
      setLoading(false);
    }
  };

  // Update resolved status of an item
  const updateResolvedStatus = async (id, resolved) => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/${id}/resolve`,
        { resolved },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: `Item marked as ${resolved ? 'resolved' : 'unresolved'}`,
        });
        fetchItems();
      } else {
        Toast.show({ type: 'error', text1: 'Failed to update status' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: err.response?.data?.message || 'Error updating status' });
    } finally {
      setLoading(false);
    }
  };

  // Send notification to poster
  const sendNotificationToPoster = async (id, message) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/${id}/notify`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        Toast.show({ type: 'success', text1: 'Notification sent to poster' });
      } else {
        Toast.show({ type: 'error', text1: 'Failed to send notification' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: err.response?.data?.message || 'Error sending notification' });
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    fetchItems,
    createItem,
    deleteItem,
    updateResolvedStatus,
    sendNotificationToPoster,
  };
};
