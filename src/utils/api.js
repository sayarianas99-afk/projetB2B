import axios from 'axios';

const api = axios.create({
  baseURL: 'https://projetb2b-production.up.railway.app/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const host = api.defaults.baseURL.replace(/\/api$/, '');
  return `${host}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default api;