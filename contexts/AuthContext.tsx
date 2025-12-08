import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  currentUser: string | null;
  login: (username: string) => void;
  logout: () => void;
  getAllUsers: () => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('fitness-ai-current-user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const login = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('fitness-ai-current-user', username);
    
    const users = getAllUsers();
    if (!users.includes(username)) {
      localStorage.setItem('fitness-ai-users', JSON.stringify([...users, username]));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fitness-ai-current-user');
  };

  const getAllUsers = (): string[] => {
    const users = localStorage.getItem('fitness-ai-users');
    return users ? JSON.parse(users) : [];
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
