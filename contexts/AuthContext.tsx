import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  needsOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { user } = await api.getMe();
        setUser(user);
        await checkOnboarding();
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const checkOnboarding = async () => {
    try {
      const { profile } = await api.getProfile();
      setNeedsOnboarding(!profile || !profile.name);
    } catch (error) {
      setNeedsOnboarding(true);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    if (data.error) throw new Error(data.error);
    
    localStorage.setItem('token', data.token);
    setUser(data.user);
    await checkOnboarding();
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await api.register(username, email, password);
    if (data.error) throw new Error(data.error);
    
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setNeedsOnboarding(true);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, needsOnboarding, login, register, logout, checkOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
