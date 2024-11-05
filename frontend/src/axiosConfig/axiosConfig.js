// axiosConfig.js

import axios from 'axios';

// Get the access token from localStorage (or any other storage method)
const accessToken = localStorage.getItem('accessToken');

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: 'https://letsconnect-6jnn.onrender.com',
});

console.log({accessToken})
// Set the Authorization header for every request
axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

export default axiosInstance;