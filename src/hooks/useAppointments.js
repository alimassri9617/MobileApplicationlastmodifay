import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/AuthStore';

export const useAppointments = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const token = useAuthStore((state) => state.authUser?.token);

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const fetchAppointments = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAppointments(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData) => {
    if (!token) return;

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAppointments(prev => [...prev, data]);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Appointment created successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  const updateAppointment = async (appointmentId, appointmentData) => {
    if (!token) return;

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAppointments(prev => prev.map(appointment => appointment._id === appointmentId ? data : appointment));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (!token) return;

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete appointment');
      }
      setAppointments(prev => prev.filter(appointment => appointment._id !== appointmentId));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Appointment deleted successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  const acceptAppointment = async (appointmentId) => {
    if (!token) return;

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/appointments/${appointmentId}/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAppointments(prev => prev.map(appointment => 
        appointment._id === appointmentId ? { ...appointment, status: 'accepted' } : appointment
      ));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Appointment accepted',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  const rejectAppointment = async (appointmentId) => {
    if (!token) return;

    try {
      const res = await fetch(`${Constants.expoConfig.extra.API_BASE_URL}/appointments/${appointmentId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAppointments(prev => prev.map(appointment => 
        appointment._id === appointmentId ? { ...appointment, status: 'rejected' } : appointment
      ));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Appointment rejected',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  return { 
    loading, 
    appointments, 
    fetchAppointments, 
    createAppointment, 
    updateAppointment, 
    deleteAppointment,
    acceptAppointment,
    rejectAppointment
  };
};

