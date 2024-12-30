const radioItemClasses = `relative bg-background border border border-shadow rounded-md block text-center
     grow
     bg-gradient-to-b from-background from-65% to-highlight shadow-inner shadow-highlight
     hover:from-45% hover:drop-shadow-md active:to-background active:translate-y-px active:drop-shadow-sm
     has-[:checked]:shadow-[0_0_4px_2px_rgba(0,0,0,0.3)]
  `;

const indicatorClasses = `absolute inset-0 w-full h-full pointer-events-none
    shadow-[0_0_4px_2px_rgba(0,0,0,0.3)] rounded-md
    transition duration-300 opacity-0 peer-checked:opacity-100 bg-accent/15 shadow-accent/35 border border-accent
  `;

const labelClasses = `px-3 py-1 flex items-center justify-center select-none cursor-pointer
drop-shadow transition peer-checked:shadow-[0_0_4px_2px_rgba(0,0,0,0.3)]`;

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
