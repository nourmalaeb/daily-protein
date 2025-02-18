'use client';

import dayjs from 'dayjs';
import MealItems from '@/components/mealItems';
import { Meter } from '@/components/meter';
import { daysFromEntries, today } from '@/lib/utils';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { redirect, useParams } from 'next/navigation';
import { AnimatedBorderDiv } from '@/components/specialContainers';
import { Suspense } from 'react';
import { useProteinStore } from '@/providers/protein-provider';
dayjs.extend(customParseFormat);
dayjs.extend(LocalizedFormat);

function Page() {
  // const data = useLoaderData<typeof loader>();
  // const navigation = useNavigation();
  const params = useParams<{ date: string }>();

  const { date } = params;

  if (!date || !dayjs(date, 'YYYY-MM-DD', true).isValid()) {
    redirect(`/${today()}`);
  }

  const { entries, goals, _hasHydrated } = useProteinStore(state => state);

  const dayData = daysFromEntries(entries, goals).find(d => d.date === date);

  return (
    <div>
      <AnimatedBorderDiv
        animate={dayData ? dayData.dailyTotal >= dayData?.goal : false}
        borderClasses="border-zinc-500/30 hover:border-zinc-500/80"
        className="rounded-xl border mx-2"
      >
        {!_hasHydrated ? (
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
