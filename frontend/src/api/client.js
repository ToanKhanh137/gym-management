import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401/403 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('gym_token');
      localStorage.removeItem('gym_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
