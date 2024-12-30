'use client';

import { useEffect, useState } from 'react';
import { RadioInput } from '@/components/radioGroup';

export const ColorModeSelector = () => {
  const savedTheme = localStorage.getItem('colorMode');

  const [activeTheme, setActiveTheme] = useState<string>(
    savedTheme || 'system'
  );

  useEffect(() => {
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
  }, [savedTheme]);

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
        options={['System', 'Light', 'Dark']}
        defaultValue={activeTheme}
        onChange={e => handleThemeChange(e.target.value)}
      />
    </>
  );
};
