import { useThemeStore } from '@/lib/store/theme-store';

export function useTheme() {
  const { theme, setTheme, getEffectiveTheme } = useThemeStore();
  
  return {
    theme,
    setTheme,
    getEffectiveTheme,
    isDark: getEffectiveTheme() === 'dark',
    isLight: getEffectiveTheme() === 'light',
    isSystem: theme === 'system',
  };
}
