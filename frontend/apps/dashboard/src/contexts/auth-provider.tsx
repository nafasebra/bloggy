import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import http from '@/lib/http';

const AUTH_TOKEN_KEY = 'bloggy_dashboard_token';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAccessToken = useCallback((token: string | null) => {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
    setAccessTokenState(token);
  }, []);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setUserState(null);
      setIsLoading(false);
      return;
    }
    http
      .get('/users/me', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => setUserState(res.data))
      .catch(() => {
        setAccessToken(null);
        setUserState(null);
      })
      .finally(() => setIsLoading(false));
  }, [accessToken, setAccessToken]);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUserState(null);
  }, [setAccessToken]);

  const value: AuthContextType = {
    accessToken,
    user,
    setAccessToken,
    setUser,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
