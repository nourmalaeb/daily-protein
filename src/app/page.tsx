'use client';

import { AppHeader } from '@/components/appHeader';
import { MainWrapper } from '@/components/mainWrapper';
import Link from 'next/link';
import { StatsPage } from '@/components/pages/stats-page';
import { Authenticated, Unauthenticated } from 'convex/react';

export default function Index() {
  return (
    <>
      <Authenticated>
        <MainWrapper>
          <AppHeader />
          <StatsPage />
        </MainWrapper>
      </Authenticated>
      <Unauthenticated>
        <Homepage />
      </Unauthenticated>
    </>
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
              className="px-4 py-1.5 border border-transparent text-teal-600 dark:text-teal-400 
              rounded bg-teal-500/10 transition
            hover:border-teal-500 hover:text-foreground dark:hover:text-foreground-dark hover:bg-transparent"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="px-4 py-1.5 border border-transparent text-orange-600 dark:text-orange-400
              rounded bg-orange-500/10 transition
            hover:border-orange-500 hover:text-foreground dark:hover:text-foreground-dark hover:bg-transparent"
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
