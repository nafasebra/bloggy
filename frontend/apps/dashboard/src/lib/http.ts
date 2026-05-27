import { attachRateLimitInterceptor } from '@repo/http-client';
import axios from 'axios';

const baseURL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:3030';

const http = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

attachRateLimitInterceptor(http);

export default http;
