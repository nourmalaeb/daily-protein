'use client';

import { useEffect, useState } from 'react';
import { RadioInput } from '@/components/radioGroup';
import { Laptop, Moon, Sun } from 'lucide-react';

export const ColorModeSelector = () => {
  const [activeTheme, setActiveTheme] = useState<string>();

  useEffect(() => {
    const savedTheme = localStorage.getItem('colorMode');

    if (savedTheme === 'system' || !savedTheme) {
      applySystemTheme();
      setActiveTheme('system');
    } else {
      applyTheme(savedTheme);
      setActiveTheme(savedTheme);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (!savedTheme || savedTheme === 'system') {
        applySystemTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const applyTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setActiveTheme(newTheme);
    localStorage.setItem('colorMode', newTheme);
    if (newTheme === 'system') {
      applySystemTheme();
    } else {
      applyTheme(newTheme);
    }
  };

  const applySystemTheme = () => {
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (systemPrefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      <RadioInput
        name={'colorModeSelector'}
        options={[
          {
            value: 'system',
            label: (
              <span className="flex gap-2 items-center">
                <Laptop size={16} />
                System
              </span>
            ),
          },
          {
            value: 'light',
            label: (
              <span className="flex gap-2 items-center">
                <Sun size={16} />
                Light
              </span>
            ),
          },
          {
            value: 'dark',
            label: (
              <span className="flex gap-2 items-center">
                <Moon size={16} />
                Dark
              </span>
            ),
          },
        ]}
        defaultValue={activeTheme}
        onChange={e => handleThemeChange(e.target.value)}
      />
    </>
  );
};
