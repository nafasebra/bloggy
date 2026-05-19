import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import http from '@/lib/http';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role?: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
  }, []);

  useEffect(() => {
    http
      .get('/users/me')
      .then((res) => {
        setUserState(res.data);
      })
      .catch(() => {
        setUserState(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const logout = useCallback(async () => {
    const webLoginUrl =
      import.meta.env.VITE_WEB_URL || 'http://localhost:3000';
    try {
      await http.post('/auth/logout');
    } catch {
      // Clear local state even if backend call fails
    } finally {
      setUserState(null);
      window.location.href = `${webLoginUrl}/auth/login`;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
