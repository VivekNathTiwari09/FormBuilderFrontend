import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';


interface User {
  userid: number;
  email: string;
  fullname: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        try {
          const response = await apiClient.get('/auth/me');
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error("Failed to authenticate token", error);
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
