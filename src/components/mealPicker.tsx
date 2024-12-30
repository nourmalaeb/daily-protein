import * as RadioGroup from '@radix-ui/react-radio-group';

const radioItemClasses = `relative bg-background dark:bg-background-dark border border-shadow dark:border-shadow-dark 
    rounded-md block text-center
     grow drop-shadow transition data-[state='checked']:shadow-[0_0_4px_2px_rgba(0,0,0,0.3)]
     bg-linear-to-b from-background dark:from-background-dark from-65% to-highlight dark:to-highlight-dark
    shadow-inner shadow-highlight dark:shadow-highlight-dark
     hover:from-45% hover:drop-shadow-md active:to-background dark:active:to-background-dark active:translate-y-px active:drop-shadow-xs
  `;

const indicatorClasses = `absolute inset-0 w-full h-full shadow-[0_0_4px_2px_rgba(0,0,0,0.3)] rounded-md
    transition duration-300 opacity-0 data-[state='checked']:opacity-100
  `;

const labelClasses = `px-2 py-1 flex items-center justify-center select-none cursor-pointer`;

export const MealPicker = ({ mealValue }: { mealValue?: string }) => {
  return (
    <RadioGroup.Root
      className="flex flex-row gap-1"
      defaultValue={mealValue}
      name="meal"
    >
      <div className={radioItemClasses}>
        <label htmlFor="r1" className={labelClasses}>
          Breakfast
        </label>
        <RadioGroup.Item value="breakfast" id="r1" className="absolute inset-0">
          <RadioGroup.Indicator
            forceMount
            className={
              indicatorClasses +
              `bg-breakfast/15 shadow-breakfast/35 border border-breakfast
              dark:border-breakfast-dark dark:bg-breakfast-dark/15 dark:shadow-breakfast-dark/35
              `
            }
          />
        </RadioGroup.Item>
      </div>
      <div className={radioItemClasses}>
        <label htmlFor="r2" className={labelClasses}>
          Lunch
        </label>
        <RadioGroup.Item value="lunch" id="r2" className="absolute inset-0">
          <RadioGroup.Indicator
            forceMount
            className={
              indicatorClasses +
              `bg-lunch/15 shadow-lunch/35 border border-lunch
              dark:border-lunch-dark dark:bg-lunch-dark/15 dark:shadow-lunch-dark/35
              `
            }
          />
        </RadioGroup.Item>
      </div>
      <div className={radioItemClasses}>
        <label htmlFor="r3" className={labelClasses}>
          Dinner
        </label>
        <RadioGroup.Item value="dinner" id="r3" className="absolute inset-0">
          <RadioGroup.Indicator
            forceMount
            className={
              indicatorClasses +
              `bg-dinner/15 shadow-dinner/35 border border-dinner
              dark:border-dinner-dark dark:bg-dinner-dark/15 dark:shadow-dinner-dark/35
              `
            }
          />
        </RadioGroup.Item>
      </div>
      <div className={radioItemClasses}>
        <label htmlFor="r4" className={labelClasses}>
          Snacks
        </label>
        <RadioGroup.Item value="snacks" id="r4" className="absolute inset-0">
          <RadioGroup.Indicator
            forceMount
            className={
              indicatorClasses +
              `bg-snacks/15 shadow-snacks/35 border border-snacks
              dark:border-snacks-dark dark:bg-snacks-dark/15 dark:shadow-snacks-dark/35
              `
            }
          />
        </RadioGroup.Item>
      </div>
    </RadioGroup.Root>
  );
};
