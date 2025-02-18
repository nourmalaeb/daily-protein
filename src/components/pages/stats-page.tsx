'use client';

import { ButtonLink } from '@/components/buttonLink';
import dayjs from 'dayjs';
import { User } from '@supabase/supabase-js';
import { Meter } from '@/components/meter';
import { ArrowRight } from 'lucide-react';
import { AnimatedBorderDiv } from '@/components/specialContainers';
import * as motion from 'motion/react-client';
import { useProteinStore } from '@/providers/protein-provider';
import useSound from 'use-sound';

export function StatsPage({ user }: { user: User }) {
  const { days, _hasHydrated } = useProteinStore(state => state);

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

  const [clickSound] = useSound('/sounds/light-click.wav', { volume: 0.625 });

  if (!user) return <div>no user</div>;

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="relative p-4 flex flex-col gap-1 items-stretch justify-center h-full grow"
    >
      {!_hasHydrated ? (
        <p>Loading...</p>
      ) : (
        days.length > 0 &&
        days.map(dayData => {
          const { date, isToday } = dayData;
          const stats = Object.fromEntries(
            dayData.meals.map(meal => [meal.meal, meal.total_protein_grams])
          );
          if (dayjs(date).isAfter(dayjs())) return null;
          return (
            <motion.div variants={listItemVariants} key={date}>
              <AnimatedBorderDiv
                animate={!!dayData?.goalMet}
                borderClasses="border-zinc-500/30 md:hover:border-zinc-500/80"
                className="rounded-xl border p-1"
              >
                <div className="px-3 pt-3">
                  <ButtonLink
                    href={`/on/${date}`}
                    className="justify-between"
                    onPointerDown={() => clickSound()}
                  >
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
        })
      )}
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
