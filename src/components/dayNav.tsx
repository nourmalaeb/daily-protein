'use client';

import dayjs from 'dayjs';
import { ButtonLink } from '@/components/buttonLink';
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
  });

  const { days } = useProteinStore(state => state);

  const outOfRange = dayjs(currentDate).isBefore(
    dayjs(days[days.length - 1].date)
  );

  return (
    <div className="flex flex-row gap-1 w-full p-4">
      <ButtonLink
        href={`/on/${prevDate}`}
        className={`px-1.5!`}
        onPointerDown={() => buttonClickSound()}
        status={
          outOfRange || currentDate === days[days.length - 1].date
            ? 'disabled'
            : undefined
        }
      >
        <ChevronLeft size={20} />
      </ButtonLink>
      <ButtonLink
        href={`/on/${today()}`}
        className="grow font-mono text-xs tracking-widest font-semibold uppercase"
        onPointerDown={() => todayClickSound()}
      >
        {dayjs(currentDate).format('ddd, MMM D, YYYY')}
      </ButtonLink>
      <ButtonLink
        status={
          outOfRange || dayjs(nextDate).isAfter(dayjs(today()))
            ? 'disabled'
            : undefined
        }
        href={`/on/${nextDate}`}
        className="px-1.5!"
        onPointerDown={() => buttonClickSound()}
      >
        <ChevronRight size={20} />
      </ButtonLink>
    </div>
  );
};

export default DayNav;
