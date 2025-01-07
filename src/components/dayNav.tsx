import dayjs from 'dayjs';
import { ButtonLink } from '@/components/buttonLink';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { today } from '@/lib/utils';
dayjs.extend(LocalizedFormat);

const DayNav = ({ currentDate }: { currentDate: string }) => {
  const nextDate = dayjs(currentDate).add(1, 'd').format('YYYY-MM-DD');
  const prevDate = dayjs(currentDate).subtract(1, 'd').format('YYYY-MM-DD');
  // console.log({ currentDate, nextDate, prevDate });

  return (
    <div className="flex flex-row gap-1 w-full p-4">
      <ButtonLink
        href={`/on/${prevDate}`}
        className={`px-1.5!`}
        // status={navigation.state === 'loading' ? 'disabled' : undefined}
      >
        <ChevronLeft size={20} />
      </ButtonLink>
      <ButtonLink
        href={`/on/${dayjs(today()).format('YYYY-MM-DD')}`}
        className="grow font-mono"
        // status={navigation.state === 'loading' ? 'disabled' : undefined}
      >
        {dayjs(currentDate).format('ll')}
      </ButtonLink>
      <ButtonLink
        status={dayjs(nextDate).isAfter(dayjs()) ? 'disabled' : undefined}
        href={`/on/${nextDate}`}
        className="px-1.5!"
      >
        <ChevronRight size={20} />
      </ButtonLink>
    </div>
  );
};

export default DayNav;
