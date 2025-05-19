'use client';

import { DayProgressRing } from '@/components/dayProgressRing';
import { Meter } from '@/components/meter';
import { cn, daysToWeeks } from '@/lib/utils';
import { useProteinStore } from '@/providers/protein-provider';
import { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const DAY_SIZE = 40;
const GAP_SIZE = 8;
const EFFECTIVE_DAY_WIDTH = DAY_SIZE + GAP_SIZE;
const WEEK_WIDTH = EFFECTIVE_DAY_WIDTH * 7;
const weekWidthClass = `w-[${WEEK_WIDTH}px]`;

const weekClasses = cn(
  'flex flex-row-reverse gap-1 snap-center snap-always scroll-mx-8 last-of-type:ml-20',
  weekWidthClass
);

const VIRTUALIZER_PADDING_ITEMS = 4;
const PADDING_START_OFFSET = EFFECTIVE_DAY_WIDTH * VIRTUALIZER_PADDING_ITEMS;

export default function Widgets({ currentDate }: { currentDate: string }) {
  // const data = useLoaderData<typeof loader>();
  // const navigation = useNavigation();
  const { days, _hasHydrated, fetchEntries } = useProteinStore(state => state);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const reversedDays = days.toReversed();

  const dayVirtualizer = useVirtualizer({
    count: reversedDays.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => EFFECTIVE_DAY_WIDTH,
    horizontal: true,
    overscan: 12,
    paddingStart: PADDING_START_OFFSET,
    paddingEnd: PADDING_START_OFFSET,
  });

  useEffect(() => {
    if (days && days.length > 0) {
      const todaysIndex = days.findIndex(day => day.date === currentDate);
      setCurrentIndex(todaysIndex);
    }
  }, [days, currentDate]);

  useEffect(() => {
    if (dayVirtualizer.isScrolling) {
      return;
    } else {
      const { scrollOffset, getTotalSize, scrollToIndex } = dayVirtualizer;
      const width = getTotalSize() - PADDING_START_OFFSET * 2;
      const progress = scrollOffset ? scrollOffset / width : 0;
      const closestIndex = Math.floor(progress * reversedDays.length);
      console.log(closestIndex);
      scrollToIndex(closestIndex, { align: 'center', behavior: 'smooth' });
      setCurrentIndex(closestIndex);
    }
  }, [dayVirtualizer.isScrolling]);

  if (!_hasHydrated || !days || days.length === 0) return <p>Loading...</p>;

  const weeks = daysToWeeks(days);

  return (
    <>
      {/* <div>{currentIndex}</div> */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto w-full no-scrollbar"
      >
        <div
          className="relative no-scrollbar"
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
                onClick={() =>
                  dayVirtualizer.scrollToIndex(virtualDay.index, {
                    align: 'center',
                    behavior: 'smooth',
                  })
                }
              />
            );
          })}
        </div>
      </div>
      {reversedDays[currentIndex] && (
        <Meter
          date={currentDate}
          stats={{
            breakfast: reversedDays[currentIndex].meals[0].total_protein_grams,
            lunch: reversedDays[currentIndex].meals[1].total_protein_grams,
            dinner: reversedDays[currentIndex].meals[2].total_protein_grams,
            snacks: reversedDays[currentIndex].meals[3].total_protein_grams,
          }}
          goal={reversedDays[currentIndex].goal}
        />
      )}
    </>
  );
}
