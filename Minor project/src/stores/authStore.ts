import { create } from 'zustand';

type UserRole = 'voter' | 'commissioner' | null;

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string, phoneNumber: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

// This is a mock implementation; in a real app, this would connect to a backend API
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  initialized: false,

  checkAuth: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ user, isAuthenticated: true, initialized: true });
      } catch (error) {
        set({ user: null, isAuthenticated: false, initialized: true });
      }
    } else {
      set({ initialized: true });
    }
  },

  login: async (username, password) => {
    try {
      // In a real implementation, this would be an API call
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      if (username === 'voter' && password === 'password') {
        const user = {
          id: '1',
          username: 'voter',
          email: 'voter@example.com',
          role: 'voter' as UserRole
        };
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true });
        return true;
      } else if (username === 'commissioner' && password === 'password') {
        const user = {
          id: '2',
          username: 'commissioner',
          email: 'commissioner@example.com',
          role: 'commissioner' as UserRole
        };
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  register: async (email, username, password, phoneNumber, role) => {
    try {
      // In a real implementation, this would be an API call
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration logic
      const user = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        email,
        role
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  }
}));