import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from '../types/user';

const USER_KEY = 'user';

export async function saveUser(user: User) {
  const value = JSON.stringify(user);

  if (Platform.OS === 'web') {
    localStorage.setItem(USER_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(USER_KEY, value);
}

export async function getUser(): Promise<User | null> {
  if (Platform.OS === 'web') {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  const data = await SecureStore.getItemAsync(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function removeUser() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(USER_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(USER_KEY);
}