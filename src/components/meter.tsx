import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';

type Stats = {
  breakfast?: number;
  lunch?: number;
  dinner?: number;
  snacks?: number;
};

type MeterProps = {
  stats?: Stats;
  goal: number;
  date?: string;
};

export const Meter = ({ stats, goal, date }: MeterProps) => {
  const total =
    (stats?.breakfast || 0) +
    (stats?.lunch || 0) +
    (stats?.dinner || 0) +
    (stats?.snacks || 0);

  const ratio = goal / total < 1 ? goal / total : 1;

  const numberOfRemainingMeals = stats
    ? 4 - Object.values(stats).reduce((acc, cv) => acc + (cv > 0 ? 1 : 0), 0)
    : 4;

  const distanceFromGoal = goal - total;
  const DistanceRemaining = () =>
    distanceFromGoal > 0 ? (
      <div className="px-3 py-2 rounded-lg bg-highlight/50 dark:bg-shadow-dark/20 grow w-1/3">
        <p className="uppercase text-xs font-bold tracking-widest opacity-65">
          Remaining
        </p>
        <div className="lining-num text-md font-mono flex gap-0.5 items-baseline">
          <span>{distanceFromGoal}</span>
          <span className="opacity-70">g</span>
          <span className="ml-auto text-sm opacity-70">
            {Math.round((100 * distanceFromGoal) / goal)}%
          </span>
        </div>
      </div>
    ) : (
      <div className="px-3 py-2 rounded-lg bg-highlight/50 dark:bg-shadow-dark/20 grow w-1/3 dark:brightness-110 saturate-150">
        <p className="uppercase text-xs font-bold tracking-widest opacity-65">
          Exceeded
        </p>
        <div className="lining-num font-mono text-md font-semibold flex gap-0.5 items-baseline text-green-600 dark:text-green-300 drop-shadow-[0_0_3px_theme(--color-green-500/.50)]">
          <span>{distanceFromGoal * -1}</span>
          <span className="opacity-70">g</span>
          <span className="ml-auto text-sm opacity-70">
            {Math.round((-100 * distanceFromGoal) / goal)}%
          </span>
        </div>
      </div>
    );

  return (
    <div className="p-3 flex flex-col gap-2">
      <div className="flex flex-row items-center gap-1 mb-1">
        <div className="px-3 py-2 rounded-lg bg-highlight/50 dark:bg-shadow-dark/20 grow w-1/3">
          <p className="uppercase text-xs font-bold tracking-widest opacity-65">
            Goal
          </p>
          <div className="lining-nums text-md font-mono flex gap-0.5">
            <span>{goal}</span>
            <span className="opacity-70">g</span>
          </div>
        </div>
        <div className="px-3 py-2 rounded-lg bg-highlight/50 dark:bg-shadow-dark/20 grow w-1/3">
          <p className="uppercase text-xs font-bold tracking-widest opacity-65">
            Total
          </p>
          <div
            className={`lining-num text-md font-mono flex gap-0.5 items-baseline${
              total >= goal
                ? ' font-semibold text-green-600 dark:text-green-300 drop-shadow-[0_0_3px_theme(--color-green-500/.50)]'
                : ' font-normal'
            }`}
          >
            <span>{total || 0}</span>
            <span className="opacity-70">g</span>
            <span className="ml-auto text-sm opacity-70">
              {Math.round((total * 100) / goal)}%
            </span>
          </div>
        </div>
        <DistanceRemaining />
      </div>
      <motion.div
        className={`relative flex flex-row gap-px items-center px-3 saturate-120 ${
          distanceFromGoal <= 0
            ? 'brightness-120 dark:brightness-105'
            : 'brightness-105'
        }`}
        layout={!!date}
        layoutId={date ? `meterContainer-${date}` : undefined}
      >
        <MeterBar
          category="breakfast"
          amount={stats?.breakfast ? stats.breakfast * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
          goalMet={distanceFromGoal <= 0}
          goal={goal}
          date={date}
        />
        <MeterBar
          category="lunch"
          amount={stats?.lunch ? stats.lunch * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
          goalMet={distanceFromGoal <= 0}
          goal={goal}
          date={date}
        />
        <MeterBar
          category="dinner"
          amount={stats?.dinner ? stats.dinner * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
          goalMet={distanceFromGoal <= 0}
          goal={goal}
          date={date}
        />
        <MeterBar
          category="snacks"
          amount={stats?.snacks ? stats.snacks * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
          goalMet={distanceFromGoal <= 0}
          goal={goal}
          date={date}
        />
        <MeterBar
          category="remaining"
          numberOfRemainingMeals={1}
          total={total}
          hidden={numberOfRemainingMeals > 0 || total >= goal}
          goal={goal}
          date={date}
        />
        <AnimatePresence>
          {distanceFromGoal < 0 && (
            <motion.div
              className={`w-6 h-2 relative -left-3 origin-left transition-all animate-meter-bar-show brightness-105`}
              exit={{ opacity: 0 }}
            >
              <div className="absolute blur-xs grow-0 shrink-0 bg-linear-to-r from-transparent via-white to-transparent w-6 h-2 rounded-r-full" />
              <div className="absolute blur-xs grow-0 shrink-0 bg-linear-to-r from-transparent via-white to-transparent w-6 h-2 rounded-r-full" />
              <div className="absolute blur-xs grow-0 shrink-0 bg-linear-to-r from-transparent via-white to-transparent w-5 h-2 left-2 rounded-r-full" />
              <div className="absolute grow-0 shrink-0 bg-linear-to-r from-transparent to-accent w-6 h-2 -left-3 rounded-r-full" />
              <div className="absolute grow-0 shrink-0 bg-linear-to-r from-transparent via-70% via-white to-transparent w-5 h-2 rounded-r-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

type MeterBarProps = {
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'remaining';
  total?: number;
  numberOfRemainingMeals: number;
  amount?: number;
  goal: number;
  goalMet?: boolean;
  date?: string;
  hidden?: boolean;
};

const MeterBar = ({
  amount,
  category,
  total,
  goal,
  goalMet,
  numberOfRemainingMeals,
  date,
  hidden,
  ...props
}: MeterBarProps) => {
  const glowClasses = goalMet
    ? ' shadow-accent/40 dark:shadow-white/40 shadow-glow border-white/30'
    : '';

  const widthAsPercent = hidden
    ? 0
    : amount
    ? (amount / goal) * 100
    : (100 * (goal - (total || 0))) / goal / numberOfRemainingMeals;

  const categoryColors = (barWidth: number) => ({
    breakfast: `border-breakfast dark:border-breakfast-dark w-[${barWidth}%] ${
      amount && amount > 0 && 'bg-breakfast dark:bg-breakfast-dark'
    }`,
    lunch: `border-lunch dark:border-lunch-dark w-[${barWidth}%] ${
      amount && amount > 0 && 'bg-lunch dark:bg-lunch-dark'
    }`,
    dinner: `border-dinner dark:border-dinner-dark w-[${barWidth}%] ${
      amount && amount > 0 && 'bg-dinner dark:bg-dinner-dark'
    }`,
    snacks: `border-snacks dark:border-snacks-dark w-[${barWidth}%] ${
      amount && amount > 0 && 'bg-snacks dark:bg-snacks-dark'
    }`,
    remaining: `border-zinc-500${hidden ? ' w-0 opacity-0' : ' relative'}`,
  });

  return (
    <motion.div
      layoutId={date ? `meterBar-${category}` : undefined}
      className={`h-2 border grow-0 shrink-0 rounded-full${glowClasses} ${
        categoryColors(widthAsPercent)[category]
      }`}
      {...props}
      style={{
        flexBasis: widthAsPercent + '%',
        opacity: hidden ? 0 : 1,
        borderRadius: 99,
      }}
    ></motion.div>
  );
};
