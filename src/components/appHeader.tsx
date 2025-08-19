'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/buttonLink';
import { User } from '@supabase/supabase-js';
import AccountForm from '@/components/account-form';
import { UserPreferences } from '@/lib/types';
import { useProteinStore } from '@/providers/protein-provider';
import useSound from 'use-sound';
import { Settings2, X } from 'lucide-react';

const ColorModeSelector = dynamic(() =>
  import('@/components/colorModeSelector').then(mod => mod.ColorModeSelector)
);

export const AppHeader = ({ user }: { user?: User }) => {
  const [goHomesound] = useSound('/sounds/boop.wav', {
    playbackRate: 1.25,
    volume: 0.75,
    html5: true,
  });
  const { preferences } = useProteinStore(state => state);

  const mappedPreferences = preferences.reduce<UserPreferences>((acc, cv) => {
    acc[cv.preference_key] = cv.preference_value;
    return acc;
  }, {});

  return (
    <header className="flex flex-row items-center justify-between py-4 border-b border-zinc-500 mx-4 text-foreground dark:text-foreground-dark">
      <Link href={'/'} onPointerDown={() => goHomesound()}>
        <h1 className="w-min leading-none text-sm font-medium">
          daily protein
        </h1>
      </Link>
      {user && <NavDialog preferences={mappedPreferences} />}
    </header>
  );
};

export const NavDialog = ({
  preferences,
}: {
  preferences: UserPreferences;
}) => {
  const [thunkSound] = useSound('/sounds/thuthunk.wav', {
    volume: 0.5,
    html5: true,
  });
  const [closeSound] = useSound('/sounds/light-click.wav', {
    volume: 0.5,
    html5: true,
  });
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger onPointerDown={() => thunkSound()}>
        <Settings2 size={20} />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-shadow/30 dark:bg-shadow-dark/30 fixed inset-0 transition backdrop-blur-[8px] data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-hide" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          key="settings"
          className="bg-background dark:bg-background-dark fixed overflow-y-scroll
            transform left-1/2 -translate-x-1/2 top-4
            w-11/12 max-w-sm max-h-[calc(100vh_-_2rem)]
            border border-highlight dark:border-highlight-dark rounded-xl shadow-xl
            transition data-[state=open]:animate-modal-content-show data-[state=closed]:animate-modal-content-hide"
        >
          <DialogPrimitive.Title asChild>
            <div className="font-bold flex justify-between p-4 bg-background dark:bg-background-dark sticky top-0 z-10">
              <h2 className="text-xl">Preferences</h2>
              <DialogPrimitive.Close asChild>
                <Button
                  type="button"
                  className="size-7 !p-0"
                  onPointerDown={() => closeSound()}
                >
                  <X size={16} />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Title>
          <div className="flex flex-col items-stretch gap-8 p-4">
            <AccountForm preferences={preferences} />
            {/* <ButtonLink href="/account" intent={'primary'}>
              Manage account
            </ButtonLink> */}
            <div className="flex flex-col gap-3 items-start">
              <label className="font-bold" htmlFor="appearance">
                Appearance
              </label>
              <ColorModeSelector />
              <p>This setting is saved locally on each device.</p>
            </div>
            <form action="/signout" method="post" className="flex flex-col">
              <Button type="submit">Sign out</Button>
            </form>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
