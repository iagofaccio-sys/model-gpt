import { api } from './api';
import { LoginRequest, LoginResponse } from '../types/auth';

export async function loginService(data: LoginRequest): Promise<LoginResponse> {
  console.log('BASE URL LOGIN:', api.defaults.baseURL);
  console.log('PAYLOAD LOGIN:', data);

  const response = await api.post('/login', data);

  console.log('RESPOSTA LOGIN:', response.data);

  return response.data;
}

export async function forgotPasswordService(email: string): Promise<void> {
  await api.post('/forgot-password', { email });
}