import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AuthData } from '../types';

interface AuthContextType {
  user: AuthData | null;
  loginUser: (authData: AuthData) => void;
  logoutUser: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthData | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loginUser = useCallback((authData: AuthData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData));
    setUser(authData);
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
