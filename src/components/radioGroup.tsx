const radioItemClasses = `relative bg-background dark:bg-background-dark border border-shadow dark:border-shadow-dark 
     rounded-md block text-center grow
     bg-linear-to-b from-background dark:from-background-dark from-65% to-highlight dark:to-highlight-dark
     shadow-inner shadow-highlight dark:shadow-highlight-dark
     hover:from-45% hover:drop-shadow-md
     active:to-background dark:active:to-background-dark active:translate-y-px active:drop-shadow-xs
     has-checked:shadow-[0_0_4px_2px_rgba(0,0,0,0.3)] dark:has-checked:shadow-[0_0_4px_2px_rgba(1,1,1,0.3)]
  `;

const indicatorClasses = `absolute inset-0 w-full h-full pointer-events-none
    shadow-[0_0_4px_2px_rgba(0,0,0,0.3)] dark:shadow-[0_0_4px_2px_rgba(1,1,1,0.3)] rounded-md
    transition duration-300 opacity-0 peer-checked:opacity-100 bg-accent/15 shadow-accent/35 border border-accent
  `;

const labelClasses = `px-3 py-1 flex items-center justify-center select-none cursor-pointer
drop-shadow transition`;

export const RadioInput = ({
  defaultValue,
  name,
  options,
  onChange,
  ...props
}: {
  defaultValue?: string;
  name: string;
  options: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}) => {
  return (
    <div className="flex flex-row gap-1" {...props}>
      {options.map((option, idx) => (
        <div key={option} className={radioItemClasses}>
          <input
            type="radio"
            value={option.toLowerCase()}
            name={name}
            id={`radio-${name}-${idx}`}
            className="hidden peer"
            onChange={onChange}
            defaultChecked={
              defaultValue
                ? defaultValue.toLowerCase() === option.toLowerCase()
                : options[0].toLowerCase() === option.toLowerCase()
            }
          />
          <label htmlFor={`radio-${name}-${idx}`} className={labelClasses}>
            {option}
          </label>
          <div className={indicatorClasses} />
        </div>
      ))}
    </div>
  );
};
