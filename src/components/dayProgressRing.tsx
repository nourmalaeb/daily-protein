'use client';

import { cn } from '@/lib/utils';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { RefObject } from 'react';

type Stats = {
  breakfast?: number;
  lunch?: number;
  dinner?: number;
  snacks?: number;
};

type ProgressRingProps = {
  stats?: Stats;
  goal: number;
  size: number;
  date: string;
  active: boolean;
  className?: string;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
  onClick?: () => void;
};

// Define a mapping for meal types to their Tailwind fill classes
const mealFillClasses: Record<keyof Stats, string> = {
  breakfast: 'fill-breakfast dark:fill-breakfast-dark',
  lunch: 'fill-lunch dark:fill-lunch-dark',
  dinner: 'fill-dinner dark:fill-dinner-dark',
  snacks: 'fill-snacks dark:fill-snacks-dark',
};

export const DayProgressRing = ({
  stats,
  active,
  goal,
  size,
  date,
  className,
  style,
  onClick,
}: ProgressRingProps) => {
  const total =
    (stats?.breakfast || 0) +
    (stats?.lunch || 0) +
    (stats?.dinner || 0) +
    (stats?.snacks || 0);

  const mealCategories: ('breakfast' | 'lunch' | 'dinner' | 'snacks')[] = [
    'breakfast',
    'lunch',
    'dinner',
    'snacks',
  ];

  const data = mealCategories.map((meal, idx) => ({
    meal: meal,
    amount: stats?.[meal] ?? 0,
    percentage: (stats?.[meal] ?? 0) / Math.max(goal, total),
    startPercentage: stats
      ? Object.values(stats)
          .slice(0, idx)
          .reduce((acc, meal) => acc + meal, 0) / Math.max(goal, total)
      : 0,
    mealClassName: mealFillClasses[meal],
  }));

  const dayOfTheMonth = date ? new Date(date).getUTCDate() : null;

  return (
    <>
      <motion.div
        style={{ ...style, width: size, height: size }}
        className={cn(
          className,
          'rounded-full relative flex-none opacity-80 transition-opacity hover:opacity-100',
          active && 'opacity-100'
        )}
        layout
        onClick={onClick}
      >
        <Ring size={size} data={data} date={date} active={active} />

        {dayOfTheMonth && (
          <span
            className={cn(
              'absolute rounded-full inset-4 grid place-items-center font-semibold text-sm font-mono opacity-70 select-none cursor-pointer transition-all',
              total >= goal &&
                'text-green-700 dark:text-green-300 opacity-100 font-bold',
              active && 'opacity-100 bg-white/75 dark:bg-black inset-1.5'
            )}
          >
            {dayOfTheMonth}
          </span>
        )}
      </motion.div>
    </>
  );
};

type RingProps = {
  size: number;
  date: string;
  active: boolean;
  data: {
    meal: string;
    amount: number;
    percentage: number;
    startPercentage: number;
    mealClassName: string;
  }[];
};

const Ring = ({ size, data, date, active }: RingProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn(
        'absolute inset-0 transition-all',
        active ? 'scale-100' : 'scale-80'
      )}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 2}
        className="stroke-white dark:stroke-black opacity-75"
        strokeWidth={4}
        fill="none"
      />
      {data.map(({ meal, percentage, startPercentage, mealClassName }, idx) => {
        const d = d3.arc().cornerRadius(size)({
          innerRadius: active ? size / 2 - 4 : size / 2 - 3,
          outerRadius: active ? size / 2 : size / 2 - 1,
          startAngle: startPercentage * Math.PI * 2,
          endAngle: (percentage + startPercentage) * Math.PI * 2,
          padAngle: 0.025,
        });

        if (!d) return null;

        return (
          <path
            key={idx * percentage * startPercentage + meal + date}
            d={d}
            transform={`translate(${size / 2}, ${size / 2})`}
            className={mealClassName}
          />
        );
      })}
    </svg>
  );
};
