import axios from 'axios';

const http = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
  timeout: 10000,
});

export default http;
