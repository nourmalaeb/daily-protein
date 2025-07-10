'use client';

import dayjs from 'dayjs';
import { Button, ButtonLink } from '@/components/buttonLink';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { today } from '@/lib/utils';
import useSound from 'use-sound';
import { useProteinStore } from '@/providers/protein-provider';
dayjs.extend(LocalizedFormat);

const DayNav = ({ currentDate }: { currentDate: string }) => {
  const nextDate = dayjs(currentDate).add(1, 'd').format('YYYY-MM-DD');
  const prevDate = dayjs(currentDate).subtract(1, 'd').format('YYYY-MM-DD');
  // console.log({ currentDate, nextDate, prevDate });
  const [buttonClickSound] = useSound('/sounds/lightClick.wav');
  const [todayClickSound] = useSound('/sounds/brightClick.wav', {
    volume: 0.5,
    html5: true,
  });

  const { days, currentDay, setCurrentDay } = useProteinStore(state => state);

  const outOfRange = dayjs(currentDate).isBefore(
    dayjs(days[days.length - 1]?.date)
  );

  return (
    <div className="flex flex-row gap-1 w-full p-4">
      <Button
        onClick={() => {
          setCurrentDay(
            outOfRange || currentDate === days[days.length - 1].date
              ? days[days.length - 1].date
              : prevDate
          );
        }}
        className={`px-1.5!`}
        onPointerDown={() => buttonClickSound()}
        status={
          outOfRange || currentDate === days[days.length - 1].date
            ? 'disabled'
            : undefined
        }
      >
        <ChevronLeft size={20} />
      </Button>
      <Button
        onClick={() => {
          setCurrentDay(today());
        }}
        className="grow font-mono text-xs tracking-widest font-semibold uppercase"
        onPointerDown={() => todayClickSound()}
      >
        {dayjs(currentDate).format('ddd, MMM D, YYYY')}
      </Button>
      <Button
        status={
          outOfRange || dayjs(nextDate).isAfter(dayjs(today()))
            ? 'disabled'
            : undefined
        }
        onClick={() => {
          setCurrentDay(
            outOfRange || dayjs(nextDate).isAfter(dayjs(today()))
              ? today()
              : nextDate
          );
        }}
        className="px-1.5!"
        onPointerDown={() => buttonClickSound()}
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};

export default DayNav;
