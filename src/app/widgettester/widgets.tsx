'use client';

import { DayProgressRing } from '@/components/dayProgressRing';
import { Meter } from '@/components/meter';
import { useProteinStore } from '@/providers/protein-provider';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'motion/react';

export default function Widgets({ currentDate }: { currentDate: string }) {
  // const data = useLoaderData<typeof loader>();
  // const navigation = useNavigation();
  const { days, _hasHydrated, fetchEntries } = useProteinStore(state => state);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const todaysIndex = days.findIndex(day => day.date === currentDate);
    setCurrentIndex(todaysIndex);
  }, []);

  const reversedDays = days.toReversed();

  const scrollRef = useRef(null);

  const { scrollXProgress, scrollX } = useScroll({
    target: scrollRef,
    offset: ['end end', 'start start'],
  });

  return (
    <>
      <motion.div
        className="relative flex flex-row-reverse overflow-x-auto snap-x snap-mandatory gap-3 scroll-px-[50%] px-[45%] no-scrollbar"
        ref={scrollRef}
      >
        {/* <motion.div
          className="flex flex-row gap-1"
          style={{ width: days.length * 41 + 'px' }}
        > */}
        {days.map((day, idx) => (
          <motion.div
            className="scroll-ml-0 snap-center"
            key={day.date}
            initial={{ opacity: 1, scale: 0.25 }}
            whileInView={{ opacity: 1, scale: 1 }}
            // viewport={{ amount: 1 }}
          >
            <DayProgressRing
              key={day.date}
              size={40}
              stats={{
                breakfast: day?.meals[0].total_protein_grams,
                lunch: day?.meals[1].total_protein_grams,
                dinner: day?.meals[2].total_protein_grams,
                snacks: day?.meals[3].total_protein_grams,
              }}
              goal={day.goal}
              date={day.date}
            />
          </motion.div>
        ))}
        {/* </motion.div> */}
      </motion.div>
      <Meter
        date={currentDate}
        stats={{
          breakfast: days[0].meals[0].total_protein_grams,
          lunch: days[0].meals[1].total_protein_grams,
          dinner: days[0].meals[2].total_protein_grams,
          snacks: days[0].meals[3].total_protein_grams,
        }}
        goal={days[0].goal}
      />
    </>
  );
}
