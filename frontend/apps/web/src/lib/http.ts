import axios from 'axios';

const baseURL =
  typeof window !== 'undefined'
    ? '/api/backend'
    : process.env.API_URL || 'http://localhost:3030';

const http = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

export default http;
