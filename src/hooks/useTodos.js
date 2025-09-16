import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/AuthStore';
import axios from 'axios';
import Constants from 'expo-constants';
export const useTodos = () => {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);

  const token = useAuthStore((state) => state.authUser?.token);

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/todo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(token);
      if (!res.ok) throw new Error(data.message || 'Failed to fetch todos');
      setTodos(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Fetch error', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData) => {
    try {
      // Validate required fields here or ensure UI forces it
      if (!todoData.title || !todoData.date || !todoData.priority) {
        Toast.show({
          type: 'error',
          text1: 'Validation error',
          text2: 'Title, date and priority are required.',
        });
        return;
      }

      const payload = {
        title: todoData.title,
        description: todoData.description || '',
        date: todoData.date,
        startTime: todoData.startTime || null,
        endTime: todoData.endTime || null,
        completed: todoData.completed ?? false,
        priority: todoData.priority, // Must be "Top", "Moderate", or "Low"
      };

      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create todo');

      setTodos((prev) => [...prev, data]);
      Toast.show({ type: 'success', text1: 'Todo created' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Create error', text2: error.message });
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const res = await axios.put(`${Constants.expoConfig.extra.API_BASE_URL}/todo/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state instantly
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? res.data : todo))
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update todo');
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/todo/${todoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete todo');
      }

      setTodos((prev) => prev.filter((todo) => todo._id !== todoId));
      Toast.show({ type: 'success', text1: 'Todo deleted' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Delete error', text2: error.message });
    }
  };

  return {
    loading,
    todos,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  };
};



/*
{
    "_id": "684bff581057c330ecfd4066",
    "uniId": "202210810",
    "firstName": "Mohamad",
    "lastName": "Smeha",
    "email": "moSmeha@ua.edu.lb",
    "gender": "male",
    "profilePic": "https://res.cloudinary.com/dfqoetbhv/image/upload/v1754230721/lost-and-found/pjtjliozhcweonka35zc.jpg",
    "role": "admin",
    "Department": "Computer and Communications Engineering",
    "schedule": [
        {
            "day": "Monday",
            "subject": "Accounting and finance - BUS112",
            "startTime": "09:00",
            "endTime": "10:30",
            "mode": "campus",
            "room": "ADM-201",
            "_id": "684bff581057c330ecfd4067"
        },
        {
            "day": "Tuesday",
            "subject": "Oral and Written Communication - COMM001",
            "startTime": "11:00",
            "endTime": "12:30",
            "mode": "online",
            "room": "Zoom-ADM01",
            "_id": "684bff581057c330ecfd4068"
        },
        {
            "day": "Wednesday",
            "subject": "Nutrituin - SPO451",
            "startTime": "14:00",
            "endTime": "15:30",
            "mode": "campus",
            "room": "ADM-105",
            "_id": "684bff581057c330ecfd4069"
        },
        {
            "day": "Thursday",
            "subject": "Web Development 2 - SYS554",
            "startTime": "13:00",
            "endTime": "14:30",
            "mode": "online",
            "room": "GoogleMeet-ADM",
            "_id": "684bff581057c330ecfd406a"
        },
        {
            "day": "Friday",
            "subject": "Data Structures and Algorithms - SYS332",
            "startTime": "10:00",
            "endTime": "11:30",
            "mode": "campus",
            "room": "ADM-310",
            "_id": "684bff581057c330ecfd406b"
        }
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODRiZmY1ODEwNTdjMzMwZWNmZDQwNjYiLCJpYXQiOjE3NTUzNDgwMzQsImV4cCI6MTc1NjY0NDAzNH0.Bvwc3EmANJurrtagzIcsDZZq-2fjQEBk6DrRZqxPvu4"
}
todus

[
    {
        "_id": "688f62e4c7be8af896296828",
        "userId": "684bff581057c330ecfd4066",
        "title": "Hello1",
        "priority": "Moderate",
        "description": "Hello",
        "date": "2025-09-23T00:00:00.000Z",
        "startTime": null,
        "endTime": null,
        "completed": false,
        "createdAt": "2025-08-03T13:23:48.513Z",
        "updatedAt": "2025-08-03T13:24:00.483Z",
        "__v": 0
    }
]


*/