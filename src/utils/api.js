// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || '/api',
// });

// // Interceptor to attach the JWT token from localStorage to all outgoing requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://projetb2b-production.up.railway.app/api',
});

export default api;