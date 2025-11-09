
import axios from 'axios';
// ...existing code...

export const bookingService = {
  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },
  checkIn: async (id) => {
    const response = await api.put(`/bookings/${id}/checkin`);
    return response.data;
  },
  checkOut: async (id) => {
    const response = await api.put(`/bookings/${id}/checkout`);
    return response.data;
  },
  book: async ({ slot_id, parkingLotId }) => {
    const response = await api.post('/bookings', { slot_id, parkingLotId });
    return response.data;
  },
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};

export const parkingLotService = {
  getAllLots: async () => {
    const response = await api.get('/parking-lots');
    return response.data;
  },

  getLot: async (id) => {
    const response = await api.get(`/parking-lots/${id}`);
    return response.data;
  },

  createLot: async (lotData) => {
    const response = await api.post('/parking-lots', lotData);
    return response.data;
  },

  updateLot: async (id, lotData) => {
    const response = await api.put(`/parking-lots/${id}`, lotData);
    return response.data;
  },

  deleteLot: async (id) => {
    const response = await api.delete(`/parking-lots/${id}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/parking-lots/statistics');
    return response.data;
  }
};

export const parkingSlotService = {
  getSlotsByLot: async (lotId) => {
    const response = await api.get(`/parking-slots/lot/${lotId}`);
    return response.data;
  },

  updateSlotStatus: async (slotId, status) => {
    const response = await api.put(`/parking-slots/${slotId}/status`, { status });
    return response.data;
  }
};