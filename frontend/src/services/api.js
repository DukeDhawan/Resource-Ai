import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resource_ai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear saved token
      // Avoid redirecting on login attempt errors
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('resource_ai_token');
        localStorage.removeItem('resource_ai_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Listings endpoints
export const listingsAPI = {
  getAll: (params) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (formData) => api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
};

// Buyer Requests endpoints
export const requestsAPI = {
  getAll: (params) => api.get('/requests', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
};

// AI Matching endpoints
export const matchesAPI = {
  getForListing: (listingId, limit = 6) => api.get(`/matches/for-listing/${listingId}`, { params: { limit } }),
  getForRequest: (requestId, limit = 6) => api.get(`/matches/for-request/${requestId}`, { params: { limit } }),
  getRecommendations: (limit = 12) => api.get('/matches/recommendations', { params: { limit } }),
};

// Inquiries and Chat endpoints
export const inquiriesAPI = {
  getUnreadCount: () => api.get('/inquiries/unread-count'),
  getAll: () => api.get('/inquiries'),
  getById: (id) => api.get(`/inquiries/${id}`),
  create: (data) => api.post('/inquiries', data),
  sendReply: (id, data) => api.post(`/inquiries/${id}/messages`, data),
};

// AI Analysis endpoints
export const aiAPI = {
  analyzeText: (data) => api.post('/ai/analyze-text', data),
  analyzeUpload: (formData) => api.post('/ai/analyze-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Impact & Analytics endpoints
export const analyticsAPI = {
  getImpact: () => api.get('/analytics/impact'),
};

export default api;
