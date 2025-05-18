import * as d3 from 'd3';

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
  date?: string;
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
  goal,
  size,
  date,
}: ProgressRingProps) => {
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

  const dayOfTheMonth = date ? new Date(date).getDate() : null;

  return (
    <>
      <div
        style={{ width: size, height: size }}
        className="rounded-full relative"
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            className="stroke-white dark:stroke-black opacity-75"
            strokeWidth={4}
            fill="none"
          />
          {data.map(
            ({ meal, percentage, startPercentage, mealClassName }, idx) => {
              const d = d3.arc().cornerRadius(size)({
                innerRadius: size / 2 - 4,
                outerRadius: size / 2,
                startAngle: startPercentage * Math.PI * 2,
                endAngle: (percentage + startPercentage) * Math.PI * 2,
                padAngle: 0.025,
              });

              if (!d) return null;

              return (
                <path
                  key={idx * percentage * startPercentage + meal + date}
                  d={d}
                  transform="translate(20, 20)"
                  className={mealClassName}
                />
              );
            }
          )}
        </svg>
        {dayOfTheMonth && (
          <span className="absolute inset-0 grid place-items-center font-semibold text-sm font-mono opacity-70">
            {dayOfTheMonth}
          </span>
        )}
      </div>
    </>
  );
};
