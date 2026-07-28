import { createContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types/user';
import { LoginRequest } from '../types/auth';
import { loginService } from '../services/auth.service';
import { getToken, removeToken, saveToken } from '../storage/authStorage';
import { getUser, removeUser, saveUser } from '../storage/userStorage';

type AuthContextData = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (data: LoginRequest) => Promise<User>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextData);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadSession() {
    try {
      const storedToken = await getToken();
      const storedUser = await getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(data: LoginRequest): Promise<User> {
    const response = await loginService(data);

    await saveToken(response.accessToken);
    await saveUser(response.user);

    setToken(response.accessToken);
    setUser(response.user);

    return response.user;
  }

  async function signOut() {
    await removeToken();
    await removeUser();

    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    loadSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}