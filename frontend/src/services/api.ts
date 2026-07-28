import axios from 'axios';
import { ENV } from '../config/env';
import { getToken } from '../storage/authStorage';

console.log('ENV.API_URL =', ENV.API_URL);

export const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  console.log('TOKEN NO INTERCEPTOR?', !!token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});