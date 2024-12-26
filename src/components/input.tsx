import { cva, type VariantProps } from 'class-variance-authority';

const input = cva(
  [
    'font-medium',
    'rounded-lg',
    'border',
    'bg-shadow/5',
    'text-foreground/90',
    'border-highlight',
    'shadow-inner',
    'shadow-shadow/25',
    'font-normal',
    'px-3',
    'py-1',
    'transition-all',
    'hover:bg-shadow/20',
    'focus:bg-shadow/15',
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
  ],
  {
    variants: {
      intent: {
        default: ['text-foreground'],
        positive: ['text-green-600', 'dark:text-green-400'],
        destructive: ['text-red-600', 'dark:text-red-400'],
        purple: ['text-purple-600', 'dark:text-purple-400'],
      },
    },
    defaultVariants: {
      intent: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input> {}
export interface UncontrolledInputProps extends InputProps {
  initialValue?: string;
}

export const Input: React.FC<UncontrolledInputProps> = ({
  className,
  intent,
  initialValue,
  ...props
}: UncontrolledInputProps) => {
  return <input className={input({ intent, className })} {...props} />;
};
