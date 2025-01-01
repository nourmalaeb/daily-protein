'use client';

import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export const AppHeader = ({ user }: { user?: User | null }) => {
  return (
    <header className="flex flex-row items-center justify-between py-4 border-b border-zinc-500 mx-4">
      <Link href={'/'}>
        <h1 className="w-min leading-none text-sm text-foreground font-medium dark:text-foreground-dark">
          daily protein
        </h1>
      </Link>
      {user && (
        <Link
          href="/account"
          className="rounded-full bg-zinc-400 dark:bg-zinc-600 w-8 h-8 overflow-hidden hover:bg-zinc-600 flex items-center justify-center"
        >
          {user.user_metadata?.picture ? (
            <img alt="" src={user?.user_metadata?.picture} />
          ) : (
            <span className="font-light uppercase select-none">
              {user.user_metadata.email[0]}
            </span>
          )}
        </Link>
      )}
    </header>
  );
};
