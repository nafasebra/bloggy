import { attachRateLimitInterceptor } from '@repo/http-client';
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

if (typeof window !== 'undefined') {
  attachRateLimitInterceptor(http);
  attachRateLimitInterceptor(axios);
}

export default http;
