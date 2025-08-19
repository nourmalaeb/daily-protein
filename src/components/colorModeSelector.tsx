'use client';

import { RadioInput } from '@/components/radioGroup';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import useSound from 'use-sound';

export const ColorModeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [clickSound] = useSound('/sounds/thuthunk.wav', {
    volume: 0.5,
    html5: true,
  });

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
        defaultValue={theme}
        onChange={e => {
          clickSound();
          setTheme(e.target.value);
        }}
      />
    </>
  );
};
