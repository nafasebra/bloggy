import axios from 'axios';

const baseURL = 'http://localhost:3030';

const http = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

export default http;
