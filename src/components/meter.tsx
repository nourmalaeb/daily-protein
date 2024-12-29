type Stats = {
  breakfast?: number;
  lunch?: number;
  dinner?: number;
  snacks?: number;
};

type MeterProps = {
  stats?: Stats;
  goal: number;
};

export const Meter = ({ stats, goal }: MeterProps) => {
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
      <div className="lining-num text-sm font-mono">
        <span>{distanceFromGoal}</span>
        <span className="opacity-70">g</span>
        <span> remaining</span>
      </div>
    ) : (
      <div className="lining-num text-sm font-mono font-semibold text-green-600 dark:text-green-300 drop-shadow-[0_0_3px_theme(colors.green.500/.50)]">
        <span>{distanceFromGoal * -1}</span>
        <span className="opacity-80">g</span> <span>over target</span>
      </div>
    );

  return (
    <div className="p-4 flex flex-col gap-0.5">
      <div className="flex flex-row items-center justify-between mb-1">
        <div className="lining-num text-md font-mono inline-flex gap-0.5">
          <span>{total || 0}</span>
          <span className="opacity-70">g</span>
        </div>
        <DistanceRemaining />
        <div className="lining-nums text-md font-mono inline-flex gap-0.5">
          <span>{goal || 200}</span>
          <span className="opacity-70">g</span>
        </div>
      </div>
      <div className="flex flex-row gap-px items-center">
        <MeterBar
          category="breakfast"
          amount={stats?.breakfast ? stats.breakfast * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
          goalMet={distanceFromGoal <= 0}
        />
        <MeterBar
          category="lunch"
          amount={stats?.lunch ? stats.lunch * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
          goalMet={distanceFromGoal <= 0}
        />
        <MeterBar
          category="dinner"
          amount={stats?.dinner ? stats.dinner * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
          goalMet={distanceFromGoal <= 0}
        />
        <MeterBar
          category="snacks"
          amount={stats?.snacks ? stats.snacks * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
          goalMet={distanceFromGoal <= 0}
        />
        {numberOfRemainingMeals === 0 && total < goal && (
          <MeterBar
            category="snacks"
            numberOfRemainingMeals={1}
            total={total}
          />
        )}
        {distanceFromGoal < 0 && (
          <div className="w-6 h-2 relative -left-3">
            <div className="absolute blur-sm grow-0 shrink-0 bg-gradient-to-r from-transparent via-white to-transparent w-6 h-2" />
            <div className="absolute blur-sm grow-0 shrink-0 bg-gradient-to-r from-transparent via-white to-transparent w-6 h-2" />
            <div className="absolute blur-sm grow-0 shrink-0 bg-gradient-to-r from-transparent via-white to-transparent w-5 h-2 left-2" />
            <div className="absolute grow-0 shrink-0 bg-gradient-to-r from-transparent to-accent w-6 h-2 -left-3" />
            <div className="absolute grow-0 shrink-0 bg-gradient-to-r from-transparent via-70% via-white to-transparent w-5 h-2" />
          </div>
        )}
      </div>
    </div>
  );
};

type MeterBarProps = {
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  total?: number;
  numberOfRemainingMeals: number;
  amount?: number;
  goalMet?: boolean;
};

const MeterBar = ({
  amount,
  category,
  total,
  goalMet,
  numberOfRemainingMeals,
  ...props
}: MeterBarProps) => {
  const categoryColors = () => ({
    breakfast: `border-breakfast ${
      amount && amount > 0 && 'bg-breakfast w-[' + amount / 2 + '%]'
    }`,
    lunch: `border-lunch ${
      amount && amount > 0 && 'bg-lunch w-[' + amount / 2 + '%]'
    }`,
    dinner: `border-dinner ${
      amount && amount > 0 && 'bg-dinner w-[' + amount / 2 + '%]'
    }`,
    snacks: `border-snacks ${
      amount && amount > 0 && 'bg-snacks w-[' + amount / 2 + '%]'
    }`,
  });

  const glowClasses = goalMet
    ? 'shadow-accent/40 dark:shadow-white/40 shadow-glow border-white/30'
    : '';
  return (
    <div
      className={`h-2 border grow-0 shrink-0 rounded-full ${glowClasses} ${
        categoryColors()[category]
      }`}
      {...props}
      style={{
        flexBasis: amount
          ? `calc(${amount / 2 + '%'} - 1px)`
          : `calc(${
              (200 - (total || 0)) / (numberOfRemainingMeals * 2) + '%'
            } - 1px)`,
      }}
    />
  );
};
