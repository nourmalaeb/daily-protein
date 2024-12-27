import dayjs from 'dayjs';
import { AppHeader } from '@/components/appHeader';
import { ButtonLink } from '@/components/buttonLink';
import { MainWrapper } from '@/components/mainWrapper';
import Link from 'next/link';
import { createClient } from '@/lib/utils/supabase/server';

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <MainWrapper>
      <AppHeader user={user} />
      <div className="relative p-4 flex flex-col gap-2 items-center justify-center h-full grow">
        <ButtonLink href={'/on/' + dayjs().format('YYYY-MM-DD')}>
          Log today’s macros!
        </ButtonLink>
      </div>
    </MainWrapper>
  ) : (
    <Homepage />
  );
}

const Homepage = () => {
  return (
    <main>
      <header className="w-full relative flex flex-col items-center py-8 gap-16">
        <h2 className="w-min leading-none text-sm mx-auto">daily protein</h2>
        <div className="flex flex-col items-center gap-8">
          <h1 className="w-full relative text-7xl font-extralight tracking-tighter text-center flex flex-col items-center justify-center leading-none">
            Track your daily protein intake
          </h1>
          <div className="flex flex-row gap-2">
            <Link
              href="/signup"
              className="px-4 py-1.5 border border-transparent text-proteins rounded
            bg-proteins/10 transition
            hover:border-proteins hover:text-foreground hover:bg-transparent"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="px-4 py-1.5 border border-transparent text-fats rounded
            bg-fats/10 transition
            hover:border-fats hover:text-foreground hover:bg-transparent"
            >
              Log in
            </Link>
          </div>
        </div>
        <div className="w-72 mt-12">
          <img src="/dailymacros.png" alt="" />
        </div>
      </header>
    </main>
  );
};
