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
      <div className="lining-num text-sm font-mono font-semibold text-green-600">
        <span>{distanceFromGoal * -1}</span>
        <span className="opacity-70">g</span> <span>over target</span>
      </div>
    );

  const targetMeter = distanceFromGoal > 0 ? (total / goal) * 100 : ratio * 100;
  const targetMeterClass = distanceFromGoal > 0 ? 'bg-shadow' : 'bg-green-500';

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
      <div className={`w-full rounded-full ${targetMeterClass}`}>
        <div
          style={{ width: targetMeter + '%', height: '2px' }}
          className="bg-slate-600 rounded-full"
        />
      </div>
      <div className="flex flex-row gap-px items-center">
        <MeterBar
          category="breakfast"
          amount={stats?.breakfast ? stats.breakfast * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
        />
        <MeterBar
          category="lunch"
          amount={stats?.lunch ? stats.lunch * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
        />
        <MeterBar
          category="dinner"
          amount={stats?.dinner ? stats.dinner * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
        />
        <MeterBar
          category="snacks"
          amount={stats?.snacks ? stats.snacks * ratio : 0}
          numberOfRemainingMeals={numberOfRemainingMeals * ratio}
          total={total * ratio}
        />
        {numberOfRemainingMeals === 0 && total < goal && (
          <MeterBar
            category="snacks"
            numberOfRemainingMeals={1}
            total={total}
          />
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
};

const MeterBar = ({
  amount,
  category,
  total,
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
  return (
    <div
      className={`h-2 border grow-0 shrink-0 rounded-full ${
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
