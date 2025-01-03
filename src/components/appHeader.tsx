'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Drawer } from 'vaul';
import { Button } from './button';
import dynamic from 'next/dynamic';
import { ButtonLink } from './buttonLink';

const ColorModeSelector = dynamic(() =>
  import('@/app/account/colorModeSelector').then(mod => mod.ColorModeSelector)
);

export const AppHeader = () => {
  return (
    <header className="flex flex-row items-center justify-between py-4 border-b border-zinc-500 mx-4 text-foreground dark:text-foreground-dark">
      <Link href={'/'}>
        <h1 className="w-min leading-none text-smfont-medium">daily protein</h1>
      </Link>
      <NavDrawer />
    </header>
  );
};

export const NavDrawer = () => {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger>
        <Menu size={20} />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed right-0 top-0 bottom-0 w-full bg-background dark:bg-background-dark max-w-sm p-4 flex flex-col gap-4">
          <Drawer.Title asChild>
            <div className="font-bold flex justify-between">
              <h2>Menu</h2>
              <Drawer.Close asChild>
                <Button type="button" className="size-7 !p-0">
                  <X size={16} />
                </Button>
              </Drawer.Close>
            </div>
          </Drawer.Title>
          <ButtonLink href="/account" intent={'primary'}>
            Manage account
          </ButtonLink>
          <div className="flex flex-col gap-3 items-start">
            <label className="font-bold" htmlFor="appearance">
              Appearance
            </label>
            <ColorModeSelector />
            <p>This setting is saved locally on each device.</p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
