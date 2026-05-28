'use client';

import type { ComponentProps } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

export function ThemeToggle(props: ComponentProps<typeof Button>) {
  const { setTheme, themes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="icon" variant="ghost" className="relative" {...props}>
            <Sun className="absolute size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <div className="sr-only">Toggle theme</div>
          </Button>
        }
      />

      <DropdownMenuContent>
        {themes.map(theme => (
          <DropdownMenuItem className="capitalize" key={theme} onClick={() => setTheme(theme)}>
            {theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
