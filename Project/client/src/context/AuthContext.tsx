import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from "../types";
import { getToken, getUserFromToken, isTokenValid, removeToken } from "../utils/auth";

interface AuthContextType extends AuthState {
  login: (token: string) => void;
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
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  useEffect(() => {
    const token = getToken();
    if (token && isTokenValid(token)) {
      const user = getUserFromToken(token);
      if (user) {
        setAuthState({
          isAuthenticated: true,
          user,
          token
        });
      }
    } else if (token) {
      removeToken();
    }
  }, []);

  const login = (token: string) => {
    const user = getUserFromToken(token);
    if (user) {
      setAuthState({
        isAuthenticated: true,
        user,
        token
      });
    }
  };

  const logout = () => {
    removeToken();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};