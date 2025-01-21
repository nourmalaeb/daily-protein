const radioItemClasses = `relative bg-background dark:bg-background-dark border border-shadow dark:border-shadow-dark 
     rounded-md block text-center grow
     bg-linear-to-b from-background dark:from-background-dark from-65% to-highlight dark:to-highlight-dark
     shadow-inner shadow-highlight dark:shadow-highlight-dark
     hover:from-45% hover:drop-shadow-md
     active:to-background dark:active:to-background-dark active:translate-y-px active:drop-shadow-xs active:duration-50
     has-checked:shadow-[0_0_4px_2px_rgba(0,0,0,0.3)] dark:has-checked:shadow-[0_0_4px_2px_rgba(1,1,1,0.3)]
  `;

const indicatorClasses = `absolute inset-0 w-full h-full pointer-events-none
    shadow-[0_0_4px_2px_rgba(0,0,0,0.3)] dark:shadow-[0_0_4px_2px_rgba(1,1,1,0.3)] rounded-md
    transition duration-400 opacity-0 peer-checked:opacity-100 bg-accent/15 shadow-accent/35 border border-accent
    active:duration-50
  `;

const labelClasses = `px-3 py-1 flex items-center justify-center select-none cursor-pointer
drop-shadow transition active:duration-50`;

export const RadioInput = ({
  defaultValue,
  name,
  options,
  onChange,
  className,
  ...props
}: {
  defaultValue?: string;
  name: string;
  options: { value: string; label: React.ReactNode }[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}) => {
  return (
    <div className={className || 'flex flex-row gap-1'} {...props}>
      {options.map((option, idx) => (
        <div key={option.value} className={radioItemClasses}>
          <input
            type="radio"
            value={option.value.toLowerCase()}
            name={name}
            id={`radio-${name}-${idx}`}
            className="hidden peer"
            onChange={onChange}
            defaultChecked={
              defaultValue
                ? defaultValue.toLowerCase() === option.value.toLowerCase()
                : options[0].value.toLowerCase() === option.value.toLowerCase()
            }
          />
          <label htmlFor={`radio-${name}-${idx}`} className={labelClasses}>
            {option.label}
          </label>
          <div className={indicatorClasses} />
        </div>
      ))}
    </div>
  );
};
