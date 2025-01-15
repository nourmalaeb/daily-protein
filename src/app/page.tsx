import dayjs from 'dayjs';
import { AppHeader } from '@/components/appHeader';
import { ButtonLink } from '@/components/buttonLink';
import { MainWrapper } from '@/components/mainWrapper';
import Link from 'next/link';
import { createClient } from '@/lib/utils/supabase/server';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { getDailyTotals } from '@/lib/utils/supabase/queries';
import { Meter } from '@/components/meter';
import { ArrowRight } from 'lucide-react';
import { AnimatedBorderDiv } from '@/components/specialContainers';
import * as motion from 'motion/react-client';
import { today } from '@/lib/utils';
import { getPreferences } from './account/actions';

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: preferences } = await getPreferences(supabase, user);

  return user ? (
    <MainWrapper>
      <AppHeader user={user} preferences={preferences} />
      <StatsPage supabase={supabase} user={user} />
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

async function StatsPage({
  supabase,
  user,
}: {
  supabase: SupabaseClient;
  user: User;
}) {
  const dateRange = [];
  for (let i = 0; i < 14; i++) {
    dateRange.push(dayjs(today()).subtract(i, 'day').format('YYYY-MM-DD'));
  }

  const { dailyTotals, errors } = await getDailyTotals(
    supabase,
    user,
    dateRange
  );

  if (errors.mealsError || errors.goalsError) {
    return (
      <div>
        <h4>Errors</h4>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>
    );
  }

  const listVariants = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    hidden: { opacity: 0 },
  };

  const listItemVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
    hidden: { opacity: 0, y: 4 },
  };

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="relative p-4 flex flex-col gap-1 items-stretch justify-center h-full grow"
    >
      {dailyTotals.map(dayData => {
        const { date, isToday } = dayData;
        const stats = Object.fromEntries(
          dayData.meals.map(meal => [meal.meal, meal.total_protein_grams])
        );
        return (
          <motion.div variants={listItemVariants} key={date}>
            <AnimatedBorderDiv
              animate={!!dayData?.goalMet}
              borderClasses="border-zinc-500/30 hover:border-zinc-500/80"
              className="rounded-xl border p-1"
            >
              <div className="px-3 pt-3">
                <ButtonLink href={`/on/${date}`} className="justify-between">
                  <span className="w-1/3 font-semibold">
                    {isToday ? 'Today' : dayjs(date).format('ddd')}
                  </span>
                  <span className="font-mono text-sm opacity-80 w-1/3 text-center">
                    {date}
                  </span>
                  <div className="w-1/3 flex justify-end">
                    <ArrowRight size={16} className="opacity-80" />
                  </div>
                </ButtonLink>
              </div>
              {dayData.meals.length ? (
                <Meter goal={dayData.goal} stats={stats} />
              ) : (
                <div className="p-4">
                  <p>No data for {date}</p>{' '}
                </div>
              )}
              <div className="h-1" />
            </AnimatedBorderDiv>
          </motion.div>
        );
      })}
      <motion.div variants={listItemVariants} key="accountCreated">
        <AnimatedBorderDiv
          animate
          borderClasses="border-zinc-500/30 hover:border-zinc-500/80"
          className="rounded-xl border p-5 flex flex-col gap-3 items-center mt-auto"
        >
          <p>🌱</p>
          <p className="text-center text-teal-700 dark:text-teal-200 font-mono uppercase text-xs opacity-80 font-medium tracking-widest">
            Account created on{' '}
            {dayjs(user.created_at).format('ddd MMMM DD, YYYY')}
          </p>
        </AnimatedBorderDiv>
      </motion.div>
    </motion.div>
  );
}
