'use client';

import { DayProgressRing } from '@/components/dayProgressRing';
import { Meter } from '@/components/meter';
import { useProteinStore } from '@/providers/protein-provider';
import { Suspense, useRef } from 'react';
import MealItems from '@/components/mealItems';
import { useSize } from 'react-haiku';
import { DayDataType } from '@/stores/protein-store';
import { Temporal } from 'temporal-polyfill';
import DayNav from '@/components/dayNavUsingParams';
import { cn, today } from '@/lib/utils';

export default function WeeksNav() {
  // const data = useLoaderData<typeof loader>();
  // const navigation = useNavigation();
  const { days, currentDay, setCurrentDay, _hasHydrated } = useProteinStore(
    state => state
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(scrollContainerRef);

  if (!_hasHydrated || !days || days.length === 0) return <p>Loading...</p>;

  const DAY_SIZE = width ? width / 7 - 12 : 40;

  const todayAsDay = new Date(days[0].date).getUTCDay();
  const firstDayAsDay = new Date(days[days.length - 1].date).getUTCDay();

  const numberOfBonusDaysEnd = (7 - todayAsDay) % 7;
  const numberOfBonusDaysStart = firstDayAsDay - 1;

  const BonusDaysEnd = ({ numDays }: { numDays: number }) => {
    if (!numDays) return null;
    const baseDate = Temporal.PlainDate.from(days[0].date);
    const daysToAdd = Array.from(Array(numDays)).map((_, idx) => {
      return baseDate.add({ days: numDays - idx });
    });

    return (
      <>
        {daysToAdd.map(day => (
          <div className="flex flex-col gap-1" key={day.toString()}>
            <div className="relative text-center font-mono text-xs tracking-widest font-medium uppercase opacity-70">
              {day.toLocaleString('en-us', {
                weekday: 'short',
              })}
            </div>
            <div
              className="aspect-square flex justify-center items-center rounded-full bg-shadow/45 dark:bg-shadow-dark/45 text-foreground/50 dark:text-foreground-dark/50 font-mono pointer-events-none select-none scale-80 opacity-80"
              style={{ width: `${DAY_SIZE}px`, height: `${DAY_SIZE}px` }}
              key={day.toString()}
            >
              {day.day}
            </div>
          </div>
        ))}
      </>
    );
  };

  const BonusDaysStart = ({ numDays }: { numDays: number }) => {
    if (!numDays) return null;
    const baseDate = Temporal.PlainDate.from(days[days.length - 1].date);
    const daysToAdd = Array.from(Array(numDays)).map((_, idx) => {
      return baseDate.subtract({ days: idx + 1 });
    });

    return (
      <>
        {daysToAdd.map(day => (
          <div className="flex flex-col gap-1" key={day.toString()}>
            <div className="relative text-center font-mono text-xs tracking-widest font-medium uppercase opacity-70">
              {day.toLocaleString('en-us', {
                weekday: 'short',
              })}
            </div>
            <div
              className={cn(
                `day-${day.dayOfWeek}`,
                day.dayOfWeek === 1 && 'snap-start snap-always',
                'aspect-square flex justify-center items-center rounded-full bg-shadow/45 dark:bg-shadow-dark/45 text-foreground/50 dark:text-foreground-dark/50 font-mono pointer-events-none select-none scale-80 opacity-80'
              )}
              style={{ width: `${DAY_SIZE}px`, height: `${DAY_SIZE}px` }}
              key={day.toString()}
            >
              {day.day}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <DayNav currentDate={currentDay?.date || today()} />
      <div
        className="relative flex flex-row-reverse gap-2 w-full overflow-x-scroll px-4 snap-x snap-mandatory scroll-px-4.5"
        ref={scrollContainerRef}
      >
        <BonusDaysEnd numDays={numberOfBonusDaysEnd} />
        {days.map((day: DayDataType) => (
          <div className="flex flex-col gap-1" key={`dayring-${day.date}`}>
            <div
              className={cn(
                'relative text-center font-mono text-xs tracking-widest font-medium uppercase opacity-70',
                day.date === currentDay?.date && 'font-bold'
              )}
            >
              {Temporal.PlainDate.from(day.date).toLocaleString('en-us', {
                weekday: 'short',
              })}
            </div>
            <DayProgressRing
              className={cn(
                Temporal.PlainDate.from(day.date).dayOfWeek === 1 &&
                  'snap-start snap-always'
              )}
              active={day.date === currentDay?.date}
              size={DAY_SIZE}
              stats={{
                breakfast: day?.meals[0].total_protein_grams,
                lunch: day?.meals[1].total_protein_grams,
                dinner: day?.meals[2].total_protein_grams,
                snacks: day?.meals[3].total_protein_grams,
              }}
              goal={day.goal}
              date={day.date}
              onClick={() => {
                setCurrentDay(day.date);
              }}
            />
          </div>
        ))}
        <BonusDaysStart numDays={numberOfBonusDaysStart} />
      </div>
      {currentDay && (
        <Meter
          key={currentDay.date}
          date={currentDay.date}
          stats={{
            breakfast: currentDay.meals[0].total_protein_grams,
            lunch: currentDay.meals[1].total_protein_grams,
            dinner: currentDay.meals[2].total_protein_grams,
            snacks: currentDay.meals[3].total_protein_grams,
          }}
          goal={currentDay.goal}
        />
      )}
      <Suspense>
        {currentDay?.meals.map(meal => (
          <MealItems
            key={`${currentDay.date}-${meal.meal}`}
            items={meal.items}
            category={meal.meal}
            date={currentDay.date}
          />
        ))}
      </Suspense>
    </>
  );
}
