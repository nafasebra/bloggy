import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3030';

const http = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default http;
