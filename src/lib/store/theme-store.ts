import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system', // Default to system preference
      setTheme: (theme: Theme) => {
        set({ theme });
        
        // Apply theme to document
        const root = document.documentElement;
        const effectiveTheme = theme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme;
        
        if (effectiveTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },
      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
      },
    }),
    {
      name: 'entributos-theme',
      version: 1,
    }
  )
);

// Initialize theme on store creation
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState();
  store.setTheme(store.theme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme } = useThemeStore.getState();
    if (theme === 'system') {
      store.setTheme('system');
    }
  });
}
