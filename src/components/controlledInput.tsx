'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, useEffect, useRef } from 'react';

const input = cva(
  [
    'font-medium',
    'rounded-lg',
    'border',
    'bg-shadow/5',
    'dark:bg-shadow-dark/10',
    'text-foreground/90',
    'border-highlight',
    'dark:border-highlight-dark',
    'shadow-inner',
    'shadow-shadow/25',
    'dark:shadow-shadow-dark/25',
    'font-normal',
    'px-3',
    'py-1',
    'transition-all',
    'hover:bg-shadow/20',
    'dark:hover:bg-shadow-dark/20',
    'focus:bg-shadow/15',
    'dark:focus:bg-shadow-dark/15',
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
  ],
  {
    variants: {
      intent: {
        default: ['text-foreground', 'dark:text-foreground-dark'],
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
  initialValue?: string | FormDataEntryValue | null;
  className?: string;
  autoComplete?: string;
}

export const Input: React.FC<UncontrolledInputProps> = ({
  className,
  intent,
  initialValue,
  ...props
}: UncontrolledInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current && initialValue) {
      inputRef.current.value = String(initialValue);
    }
  }, [initialValue]);

  return (
    <input ref={inputRef} className={input({ intent, className })} {...props} />
  );
};

export const ControlledInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { className, intent } = props;
    return (
      <input ref={ref} className={input({ intent, className })} {...props} />
    );
  }
);

ControlledInput.displayName = 'ControlledInput';
