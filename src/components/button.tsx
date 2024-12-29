import { cva, type VariantProps } from 'class-variance-authority';

const button = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'select-none',
    'font-medium',
    'rounded-lg',
    'border',
    'border-shadow',
    'bg-background',
    'bg-gradient-to-b',
    'from-background',
    'from-65%',
    'to-highlight',
    'text-foreground',
    'shadow-inner',
    'shadow-highlight',
    'drop-shadow',
    'normal-case',
    'font-normal',
    'transition-all',
    'duration-400',
    'hover:from-45%',
    'hover:drop-shadow-md',
    'active:to-background',
    'active:translate-y-px',
    'active:drop-shadow-sm',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:hover:drop-shadow',
    'disabled:active:translate-y-0',
    'disabled:active:drop-shadow',
    'disabled:active:to-highlight',
  ],
  {
    variants: {
      intent: {
        default: ['text-foreground'],
        positive: ['text-green-600', 'dark:text-green-400'],
        destructive: ['text-red-600', 'dark:text-red-400'],
        purple: ['text-purple-600', 'dark:text-purple-400'],
        primary: [
          'text-white',
          'from-orange-600',
          'to-orange-500',
          'shadow-orange-400',
          'active:to-orange-600',
        ],
      },
      size: {
        small: ['text-sm', 'py-1', 'px-2'],
        medium: ['text-base', 'py-1', 'px-4'],
      },
      filled: {
        true: ['!text-white'],
      },
    },
    compoundVariants: [
      {
        intent: 'default',
        filled: true,
        class: [
          'border-zinc-700',
          'bg-gradient-to-b',
          'from-zinc-700',
          'to-zinc-600',
          'shadow-zinc-500',
          'active:to-zinc-700',
        ],
      },
      {
        intent: 'positive',
        filled: true,
        class: [
          'border-emerald-700',
          'bg-gradient-to-b',
          'from-emerald-700',
          'to-emerald-500',
          'shadow-emerald-500',
          'active:to-emerald-700',
        ],
      },
      {
        intent: 'destructive',
        filled: true,
        class: [
          'border-red-700',
          'bg-gradient-to-b',
          'from-red-700',
          'to-red-500',
          'shadow-red-500',
          'active:to-red-700',
        ],
      },
    ],
    defaultVariants: {
      intent: 'default',
      size: 'medium',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  filled,
  size,
  ...props
}: ButtonProps) => (
  <button
    type={props.type || 'button'}
    className={button({ intent, size, filled, className })}
    {...props}
  />
);
