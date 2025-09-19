import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThemeStore } from '@/lib/store/theme-store';

export function ThemeSwitch() {
  const { theme, setTheme } = useThemeStore();

  const themes = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ] as const;

  const currentTheme = themes.find(t => t.value === theme) || themes[2]; // Default to system
  const Icon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-md border-border bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Icon className="h-4 w-4" />
              <span>{themeOption.label}</span>
              {theme === themeOption.value && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple toggle version for compact spaces
export function ThemeToggle() {
  const { theme, setTheme, getEffectiveTheme } = useThemeStore();

  const toggleTheme = () => {
    const effectiveTheme = getEffectiveTheme();
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-md border-border bg-background hover:bg-accent hover:text-accent-foreground"
    >
      {getEffectiveTheme() === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
