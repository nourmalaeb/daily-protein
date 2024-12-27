import { User } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import Link from 'next/link';

export const AppHeader = ({ user }: { user: User }) => {
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <header className="flex flex-row items-center justify-between py-4 border-b border-gray-500 mx-4">
      <Link href={user ? '/on/' + today : '/'}>
        <h1 className="w-min leading-none text-sm text-foreground">
          daily protein
        </h1>
      </Link>
      {user && (
        <Link
          href="/account"
          className="rounded-full bg-zinc-500 w-8 h-8 overflow-hidden hover:bg-zinc-600 flex items-center justify-center"
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
