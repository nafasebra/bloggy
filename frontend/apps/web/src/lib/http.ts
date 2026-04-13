import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3030',
  withCredentials: true,
  timeout: 10000, // 10 seconds
});

export default http;
