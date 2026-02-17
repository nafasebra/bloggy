'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { UserService } from '@/services/user.services';

interface AuthContextType {
  accessToken: string | null;
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
    role?: string;
  } | null;
  refreshToken: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
  setUser: (
    user: {
      _id: string;
      name: string;
      username: string;
      email: string;
      role?: string;
    } | null
  ) => void;
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
  const [user, setUserState] = useState<{
    _id: string;
    name: string;
    username: string;
    email: string;
    role?: string;
  } | null>(null);

  const setAccessToken = (token: string | null) => {
    if (!accessToken) {
      setAccessTokenState(token);
    }
  };

  const setUser = (
    user: {
      _id: string;
      name: string;
      username: string;
      email: string;
      role?: string;
    } | null
  ) => {
    setUserState(user);
  };

  const fetchUser = async (token: string | null) => {
    try {
      const userData = await UserService.getCurrentUser(token as string);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      const token = data.access_token ?? null;
      setAccessTokenState(token);
      setAccessToken(token);
      if (token) {
        await fetchUser(token);
      } else {
        setUser(null);
      }
    } catch (error) {
      setAccessTokenState(null);
      setAccessToken(null);
      setUser(null);
      console.error('Error refreshing token:', error);
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear the refresh_token cookie
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local state regardless of API call success
      setAccessTokenState(null);
      setAccessToken(null);
      setUser(null);
    }
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
      value={{
        accessToken,
        user,
        refreshToken,
        setAccessToken,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
