'use client';

import { DayProgressRing } from '@/components/dayProgressRing';
import { Meter } from '@/components/meter';
// import { cn, daysToWeeks } from '@/lib/utils';
import { useProteinStore } from '@/providers/protein-provider';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import MealItems from '@/components/mealItems';
import { useDebounce } from 'react-use';

const DAY_SIZE = 40;
const GAP_SIZE = 8;
const EFFECTIVE_DAY_WIDTH = DAY_SIZE + GAP_SIZE;
// const WEEK_WIDTH = EFFECTIVE_DAY_WIDTH * 7;
// const weekWidthClass = `w-[${WEEK_WIDTH}px]`;

// const weekClasses = cn(
//   'flex flex-row-reverse gap-1 snap-center snap-always scroll-mx-8 last-of-type:ml-20',
//   weekWidthClass
// );

const VIRTUALIZER_PADDING_ITEMS = 4;
const PADDING_START_OFFSET = EFFECTIVE_DAY_WIDTH * VIRTUALIZER_PADDING_ITEMS;

export default function Widgets({ currentDate }: { currentDate: string }) {
  // const data = useLoaderData<typeof loader>();
  // const navigation = useNavigation();
  const { days, _hasHydrated } = useProteinStore(state => state);
  const [currentIndex, setCurrentIndex] = useState(days.length - 1);
  const [currentDay, setCurrentDay] = useState(days[currentIndex]);
  const [scrolledAmount, setScrolledAmount] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const reversedDays = days.toReversed();

  const dayVirtualizer = useVirtualizer({
    count: reversedDays.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => EFFECTIVE_DAY_WIDTH,
    horizontal: true,
    overscan: 12,
    scrollPaddingStart: PADDING_START_OFFSET,
    scrollPaddingEnd: PADDING_START_OFFSET,
    paddingStart: PADDING_START_OFFSET,
    paddingEnd: PADDING_START_OFFSET,
    isScrollingResetDelay: 300,
  });

  const indexToOffset = (index: number) =>
    index * EFFECTIVE_DAY_WIDTH + PADDING_START_OFFSET + DAY_SIZE * 0.5;

  // useEffect(() => {
  //   if (dayVirtualizer.isScrolling) {
  //     return;
  //   }
  //   const { scrollOffset, getTotalSize, scrollToOffset } = dayVirtualizer;
  //   if (!scrollOffset || reversedDays.length === 0) {
  //     setCurrentIndex(days.length - 1);
  //   }
  //   const width = getTotalSize() - PADDING_START_OFFSET * 2;
  //   const progress = scrollOffset ? scrollOffset / width : 0;
  //   const closestIndex = Math.round(progress * reversedDays.length);
  //   // console.log({ closestIndex, width, progress, progWidth: progress * width });
  //   scrollToOffset(
  //     closestIndex * EFFECTIVE_DAY_WIDTH +
  //       PADDING_START_OFFSET +
  //       DAY_SIZE * 0.5,
  //     { align: 'center', behavior: 'smooth' }
  //   );
  //   setCurrentIndex(closestIndex);
  // }, [dayVirtualizer.isScrolling, reversedDays.length]);

  useEffect(() => {
    setCurrentIndex(days.length - 1);
    dayVirtualizer.scrollToOffset(indexToOffset(days.length - 1), {
      align: 'center',
    });
  }, [_hasHydrated, days.length]);

  const [isReady, cancel] = useDebounce(
    () => {
      const { scrollOffset, getTotalSize, scrollDirection } = dayVirtualizer;
      if (!scrollOffset || reversedDays.length === 0) {
        setCurrentIndex(days.length - 1);
      }
      const width = getTotalSize() - PADDING_START_OFFSET * 2;
      const progress = scrollOffset ? scrollOffset / width : 0;
      console.log(progress);
      const closestIndex =
        Math.abs(scrolledAmount - (scrollOffset || 0)) < DAY_SIZE * 1.5
          ? currentIndex
          : scrollDirection === 'forward'
          ? Math.ceil(progress * reversedDays.length)
          : Math.floor(progress * reversedDays.length + 0.25);

      setCurrentIndex(closestIndex);
    },
    10,
    [dayVirtualizer.scrollOffset]
  );

  const [_isReady, _cancel] = useDebounce(
    () => {
      dayVirtualizer.scrollToOffset(indexToOffset(currentIndex), {
        align: 'center',
        behavior: 'smooth',
      });
      setCurrentDay(reversedDays[currentIndex]);
      setScrolledAmount(dayVirtualizer.scrollOffset || 0);
    },
    350,
    [currentIndex]
  );

  if (!_hasHydrated || !days || days.length === 0) return <p>Loading...</p>;

  return (
    <>
      <div>
        {currentIndex} {days.length} {dayVirtualizer.scrollOffset}{' '}
        {scrolledAmount} {dayVirtualizer.scrollDirection}
      </div>
      <div className="relative w-full h-1">
        <div className="absolute w-px h-20 bg-red-400 left-1/2 top-0" />
      </div>
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto w-full no-scrollbar relative"
      >
        <div
          className="relative"
          style={{
            height: `${DAY_SIZE}px`,
            width: `${dayVirtualizer.getTotalSize()}px`,
          }}
        >
          {dayVirtualizer.getVirtualItems().map(virtualDay => {
            const day = reversedDays[virtualDay.index];
            return (
              <DayProgressRing
                style={{
                  position: 'absolute',
                  left: `${virtualDay.start}px`,
                }}
                active={virtualDay.index === currentIndex}
                key={day.date}
                size={DAY_SIZE}
                stats={{
                  breakfast: day?.meals[0].total_protein_grams,
                  lunch: day?.meals[1].total_protein_grams,
                  dinner: day?.meals[2].total_protein_grams,
                  snacks: day?.meals[3].total_protein_grams,
                }}
                goal={day.goal}
                date={day.date}
                scrollContainerRef={scrollContainerRef}
                onClick={() => {
                  setCurrentIndex(virtualDay.index);
                  dayVirtualizer.scrollToOffset(
                    indexToOffset(virtualDay.index),
                    {
                      align: 'center',
                      behavior: 'smooth',
                    }
                  );
                }}
              />
            );
          })}
        </div>
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
