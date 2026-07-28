import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export async function getUser() {
    if (Platform.OS === "web") {
        const value = localStorage.getItem("user");
        return value ? JSON.parse(value) : null;
    }

    const value = await SecureStore.getItemAsync("user");
    return value ? JSON.parse(value) : null;
}

export async function clearAuth() {
  if (Platform.OS === 'web') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return;
  }

  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('user');
}

const TOKEN_KEY = 'accessToken';

export async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}