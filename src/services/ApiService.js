import { useAuthStore } from '../store/AuthStore';
import {
  API_BASE_URL,
  API_TIMEOUT,
  DEBUG_MODE
} from '@env';

// Configure your backend API base URL here
const API_BASE_URL_FALLBACK = 'http://localhost:5000/api';
const API_TIMEOUT_FALLBACK = 10000;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL || API_BASE_URL_FALLBACK;
    this.timeout = API_TIMEOUT || API_TIMEOUT_FALLBACK;
    this.debugMode = DEBUG_MODE === 'true';
  }

  async getAuthToken() {
    try {
      const authUser = useAuthStore.getState().authUser;
      return authUser?.token || null;
    } catch (error) {
      if (this.debugMode) {
        console.error('Error getting auth token:', error);
      }
    }
    return null;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getAuthToken();

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config = {
      headers: defaultHeaders,
      timeout: this.timeout,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      if (this.debugMode) {
        console.log(`API Request: ${config.method || 'GET'} ${url}`);
      }

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      if (this.debugMode) {
        console.log(`API Response: ${response.status}`, data);
      }

      return data;
    } catch (error) {
      if (this.debugMode) {
        console.error(`API Error (${endpoint}):`, error);
      }
      throw error;
    }
  }

  // Authentication endpoints
  async login(uniId, password) {
    return this.makeRequest('auth/login', {
      method: 'POST',
      body: JSON.stringify({ uniId, password }),
    });
  }

  async logout() {
    return this.makeRequest('auth/logout', {
      method: 'POST',
    });
  }

  async signup(userData) {
    return this.makeRequest('auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  async getUsers() {
    return this.makeRequest('users');
  }

  async getStaff() {
    return this.makeRequest('users/staff');
  }

  // Message endpoints
  async getMessages(conversationId) {
    return this.makeRequest(`/messages/${conversationId}`);
  }

  async sendMessage(conversationId, message) {
    return this.makeRequest(`/messages/send/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Schedule endpoints
  async getSchedule() {
    return this.makeRequest('sch');
  }

  async createScheduleEvent(eventData) {
    return this.makeRequest('sch', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateScheduleEvent(eventId, eventData) {
    return this.makeRequest(`/sch/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteScheduleEvent(eventId) {
    return this.makeRequest(`/sch/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Todo endpoints
  async getTodos() {
    return this.makeRequest('todo');
  }

  async createTodo(todoData) {
    return this.makeRequest('todo', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
  }

  async updateTodo(todoId, todoData) {
    return this.makeRequest(`/todo/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(todoData),
    });
  }

  async deleteTodo(todoId) {
    return this.makeRequest(`/todo/${todoId}`, {
      method: 'DELETE',
    });
  }

  // Announcement endpoints
  async getAnnouncements() {
    return this.makeRequest('announcements');
  }

  async createAnnouncement(announcementData) {
    return this.makeRequest('announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  }

  async updateAnnouncement(announcementId, announcementData) {
    return this.makeRequest(`/announcements/${announcementId}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
  }

  async deleteAnnouncement(announcementId) {
    return this.makeRequest(`/announcements/${announcementId}`, {
      method: 'DELETE',
    });
  }

  // AI Chatbot endpoints
  async sendChatbotMessage(message) {
    return this.makeRequest('chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Lost and Found endpoints
  async getLostAndFoundItems() {
    return this.makeRequest('lost-and-found');
  }

  async createLostAndFoundItem(itemData) {
    return this.makeRequest('lost-and-found', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateLostAndFoundItem(itemId, itemData) {
    return this.makeRequest(`/lost-and-found/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async deleteLostAndFoundItem(itemId) {
    return this.makeRequest(`/lost-and-found/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Notes endpoints
  async getNotes() {
    return this.makeRequest('notes');
  }

  async createNote(noteData) {
    return this.makeRequest('notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(noteId, noteData) {
    return this.makeRequest(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(noteId) {
    return this.makeRequest(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  // Pomodoro endpoints
  async getPomodoroStats() {
    return this.makeRequest('pomodoro/stats');
  }

  async savePomodoroStats(statsData) {
    return this.makeRequest('pomodoro/stats', {
      method: 'POST',
      body: JSON.stringify(statsData),
    });
  }

  // Appointments endpoints
  async getAppointments() {
    return this.makeRequest('appointments');
  }

  async createAppointment(appointmentData) {
    return this.makeRequest('appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(appointmentId, appointmentData) {
    return this.makeRequest(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(appointmentId) {
    return this.makeRequest(`/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
  }

  // Notification endpoints
  async registerPushToken(tokenData) {
    return this.makeRequest('notifications/register-token', {
      method: 'POST',
      body: JSON.stringify(tokenData),
    });
  }
}

export default new ApiService();

