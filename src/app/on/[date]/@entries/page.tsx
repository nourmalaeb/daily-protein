'use client';

import dayjs from 'dayjs';
import MealItems from '@/components/mealItems';
import { Meter } from '@/components/meter';
import { today } from '@/lib/utils';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { redirect, useParams } from 'next/navigation';
import { AnimatedBorderDiv } from '@/components/specialContainers';
import { Suspense, useCallback } from 'react';
import { useProteinStore } from '@/providers/protein-provider';
import Link from 'next/link';
import { useEvent } from 'react-use';
dayjs.extend(customParseFormat);

function Page() {
  const params = useParams<{ date: string }>();

  const { date } = params;

  if (
    !date ||
    !dayjs(date, 'YYYY-MM-DD', true).isValid() ||
    dayjs(date).isAfter(today())
  ) {
    redirect(`/on/${today()}`);
  }

  const { days, _hasHydrated, fetchEntries } = useProteinStore(state => state);

  const refreshData = useCallback(() => {
    if (document.visibilityState === 'visible') {
      fetchEntries();
    }
  }, [fetchEntries]);

  useEvent('visibilitychange', refreshData);

  const dayData = days.find(d => d.date === date);

  return (
    <div>
      <AnimatedBorderDiv
        animate={dayData ? dayData.dailyTotal >= dayData?.goal : false}
        borderClasses="border-zinc-500/30 hover:border-zinc-500/80"
        className="rounded-xl border mx-2"
      >
        {!dayData ? (
          <div className="p-4">
            <p></p>
            No data for {dayjs(date).format('ddd, MMM D, YYYY')}.
            <p>
              <Link href={`/on/${today()}`}>Go to today</Link>
            </p>
            {days[days.length - 1] && (
              <p>
                <Link href={`/on/${days[days.length - 1].date}`}>
                  Go to the day you signed up (
                  {dayjs(days[days.length - 1].date).format('ddd, MMM D, YYYY')}
                  )
                </Link>
              </p>
            )}
          </div>
        ) : !_hasHydrated ? (
          <p className="p-4">Loading...</p>
        ) : (
          <Meter
            goal={dayData?.goal || 0}
            stats={{
              breakfast: dayData?.meals[0].total_protein_grams,
              lunch: dayData?.meals[1].total_protein_grams,
              dinner: dayData?.meals[2].total_protein_grams,
              snacks: dayData?.meals[3].total_protein_grams,
            }}
            date={date}
          />
        )}
      </AnimatedBorderDiv>
      <Suspense>
        {dayData?.meals.map(meal => (
          <MealItems
            key={`${date}-${meal.meal}`}
            items={meal.items}
            category={meal.meal}
            date={date}
          />
        ))}
      </Suspense>
    </div>
  );
}

export default Page;
