import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

const TOKEN_KEY = 'system_dynamics_token';

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp ? decoded.exp > currentTime : false;
  } catch {
    return false;
  }
};

export const getUserFromToken = (token: string): User | null => {
  try {
    const decoded: any = jwtDecode(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name || decoded.email.split('@')[0]
    };
  } catch {
    return null;
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasMinLength && hasUpperCase && hasNumber;
};

// Mock JWT generation for demo purposes
export const generateMockToken = (email: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: Math.random().toString(36).substr(2, 9),
    email,
    name: email.split('@')[0],
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};