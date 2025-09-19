import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  enrolled?: string[];
  progress?: Record<string, number>;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Demo credentials check
          if (email === 'demo@entributos.com' && password === 'demo123') {
            const demoUser: User = {
              id: 'demo-user-1',
              name: 'Usuario Demo',
              email: 'demo@entributos.com',
              role: 'student',
              enrolled: [
                'course_tax_fundamentals',
                'course_advanced_vat',
                'course_payroll_taxes',
                'course_income_tax'
              ],
              progress: {
                'course_tax_fundamentals': 75,
                'course_advanced_vat': 45,
                'course_payroll_taxes': 20,
                'course_income_tax': 90
              },
              avatar: 'https://i.pravatar.cc/100?u=demo'
            };
            
            set({ 
              user: demoUser, 
              token: 'demo-token-123', 
              isAuthenticated: true,
              isLoading: false 
            });
          } else {
            throw new Error('Credenciales inválidas');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: 'entributos-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);