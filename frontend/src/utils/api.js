import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const foodAPI = {
  getAllFoods: (filters) => api.get('/food', { params: filters }),
  getFoodById: (id) => api.get(`/food/${id}`),
  getDonorDonations: () => api.get('/food/donor-donations'),
  addDonation: (data) => api.post('/food/add', data),
  claimFood: (id) => api.post(`/food/claim/${id}`),
  updateFoodStatus: (id, data) => api.put(`/food/status/${id}`, data),
  deleteDonation: (id) => api.delete(`/food/${id}`),
  getLeaderboard: () => api.get('/food/leaderboard/stats'),
};

export const deliveryAPI = {
  getDeliveries: (filters) => api.get('/delivery', { params: filters }),
  getDeliveryById: (id) => api.get(`/delivery/${id}`),
  getVolunteerTasks: () => api.get('/delivery/volunteer/tasks'),
  acceptDelivery: (id) => api.post(`/delivery/${id}/accept`),
  updateDeliveryStatus: (id, data) => api.put(`/delivery/${id}/status`, data),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  getAllUsers: (filters) => api.get('/admin/users', { params: filters }),
  getAllFoods: (filters) => api.get('/admin/foods', { params: filters }),
  removeFood: (id) => api.delete(`/admin/foods/${id}`),
  verifyUser: (id, data) => api.put(`/admin/users/${id}/verify`, data),
  removeUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
