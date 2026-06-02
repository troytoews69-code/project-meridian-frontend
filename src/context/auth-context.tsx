import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { api, AuthUser } from '@/services/api';
import { clearToken, getToken, saveToken } from '@/services/token-storage';

type AuthContextValue = {
  isLoading: boolean;
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        const storedToken = await getToken();

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        const response = await api.me(storedToken);
        setToken(storedToken);
        setUser(response.user);
      } catch {
        await clearToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrapAuth();
  }, []);

  async function login(email: string, password: string) {
    const response = await api.login({ email, password });
    await saveToken(response.token);
    setToken(response.token);
    setUser(response.user);
  }

  async function register(name: string, email: string, password: string) {
    const response = await api.register({ name, email, password });
    await saveToken(response.token);
    setToken(response.token);
    setUser(response.user);
  }

  async function logout() {
    await clearToken();
    setToken(null);
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
