// axiosConfig.js

import axios from 'axios';
import { getCookie } from './cookieFunc';

// Get the access token from localStorage (or any other storage method)
const accessToken = getCookie('accessToken');

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: 'https://letsconnect-6jnn.onrender.com',
});

console.log({accessToken})

axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

export default axiosInstance;