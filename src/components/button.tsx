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
    'dark:border-shadow-dark',
    'bg-background',
    'dark:bg-background-dark',
    'bg-linear-to-b',
    'from-background',
    'dark:from-background-dark',
    'from-65%',
    'to-highlight',
    'dark:to-highlight-dark',
    'text-foreground',
    'dark:text-foreground-dark',
    'shadow-inner',
    'shadow-highlight',
    'dark:shadow-highlight-dark',
    'drop-shadow-sm',
    'normal-case',
    'font-normal',
    'transition-all',
    'duration-400',
    'hover:from-45%',
    'hover:drop-shadow-md',
    'active:to-background',
    'dark:active:to-background-dark',
    'active:translate-y-px',
    'active:drop-shadow-xs',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:hover:drop-shadow-sm',
    'disabled:active:translate-y-0',
    'disabled:active:drop-shadow-sm',
    'disabled:active:to-highlight',
  ],
  {
    variants: {
      intent: {
        default: ['text-foreground', 'dark:text-foreground-dark'],
        positive: ['text-green-600', 'dark:text-green-400'],
        destructive: ['text-red-600', 'dark:text-red-400'],
        purple: ['text-purple-600', 'dark:text-purple-400'],
        primary: [
          'text-white',
          'from-orange-600',
          'dark:from-orange-600',
          'to-orange-500',
          'dark:to-orange-500',
          'shadow-orange-400',
          'dark:shadow-orange-400',
          'active:to-orange-600',
          'dark:active:to-orange-600',
        ],
      },
      size: {
        small: ['text-sm', 'py-1', 'px-2'],
        medium: ['text-base', 'py-1', 'px-4'],
      },
      filled: {
        true: ['text-white!'],
      },
    },
    compoundVariants: [
      {
        intent: 'default',
        filled: true,
        class: [
          'border-zinc-700',
          'bg-linear-to-b',
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
          'bg-linear-to-b',
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
          'bg-linear-to-b',
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
