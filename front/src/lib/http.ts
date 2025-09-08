import axios from 'axios';

let accessToken: string | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default http;