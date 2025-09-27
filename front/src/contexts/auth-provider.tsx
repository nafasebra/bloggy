'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { setAccessToken } from '@/lib/http';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  const setAccessToken = (token: string | null) => {
    if (!accessToken) {
      setAccessTokenState(token);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        setAccessTokenState(token);
        setAccessToken(token);
      } else {
        // Handle refresh failure, e.g., logout
        setAccessTokenState(null);
        setAccessToken(null);
      }
    } catch (error) {
      setAccessTokenState(null);
      setAccessToken(null);
      console.error('Error refreshing token:', error);
    }
  };

  const logout = () => {
    setAccessTokenState(null);
    setAccessToken(null);
    // Optionally, call logout API to clear cookie
    fetch('/api/logout', { method: 'POST' });
  };

  useEffect(() => {
    refreshToken();

    // Set up interval to refresh every 1 hour (3600000 ms)
    const interval = setInterval(() => {
      refreshToken();
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, setAccessToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
