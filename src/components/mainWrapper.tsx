import { cva, type VariantProps } from 'class-variance-authority';

const mainWrapper = cva(
  [
    'flex',
    'flex-col',
    'items-stretch',
    'mx-auto',
    'min-h-dvh',
    'max-w-md',
    'antialiased',
    'font-sans',
  ],
  {
    variants: {
      debug: {
        true: ['border', 'border-zinc-700'],
      },
    },
  }
);

export interface MainWrapperProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof mainWrapper> {}

export const MainWrapper: React.FC<MainWrapperProps> = ({
  className,
  debug,
  ...props
}: MainWrapperProps) => (
  <main className={mainWrapper({ debug, className })} {...props} />
);
