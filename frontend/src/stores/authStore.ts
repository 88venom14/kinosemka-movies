import { create } from 'zustand';
import { User } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true,

  checkAuth: async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get.profile();
      if (response.data.user) {
        set({ 
          user: response.data.user, 
          token: storedToken, 
          isAuthenticated: true,
          isLoading: false 
        });
      }
    } catch (error) {
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    const response = await api.post.login(email, password);
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    set({ 
      user: userData, 
      token: newToken, 
      isAuthenticated: true 
    });
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post.register(name, email, password);
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    set({ 
      user: userData, 
      token: newToken, 
      isAuthenticated: true 
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },
}));
