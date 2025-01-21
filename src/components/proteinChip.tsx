import { Item, MealType } from '@/lib/types';
import { cva, type VariantProps } from 'class-variance-authority';
import { Plus } from 'lucide-react';

const proteinChip = cva(
  [
    'select-none',
    'font-medium',
    'rounded-md',
    'border',
    'normal-case',
    'transition-all',
    'text-sm',
    'px-2',
    'py-1',
    'inline-flex',
    'items-center',
    'gap-1',
    'active:translate-y-px',
  ],
  {
    variants: {
      meal: {
        breakfast: [
          'border-breakfast',
          'dark:border-breakfast-dark',
          'hover:bg-breakfast/10',
          'dark:hover:bg-breakfast-dark/10',
          'hover:shadow-glow',
          'hover:shadow-breakfast',
          'dark:hover:shadow-breakfast-dark',
          'bg-breakfast/5',
          'dark:bg-breakfast-dark/5',
        ],
        lunch: [
          'border-lunch',
          'dark:border-lunch-dark',
          'hover:bg-lunch/10',
          'dark:hover:bg-lunch-dark/10',
          'hover:shadow-glow',
          'hover:shadow-lunch',
          'dark:hover:shadow-lunch-dark',
          'bg-lunch/5',
          'dark:bg-lunch-dark/5',
        ],
        dinner: [
          'border-dinner',
          'dark:border-dinner-dark',
          'hover:bg-dinner/10',
          'dark:hover:bg-dinner-dark/10',
          'hover:shadow-glow',
          'hover:shadow-dinner',
          'dark:hover:shadow-dinner-dark',
          'bg-dinner/5',
          'dark:bg-dinner-dark/5',
        ],
        snacks: [
          'border-snacks',
          'dark:border-snacks-dark',
          'hover:bg-snacks/10',
          'dark:hover:bg-snacks-dark/10',
          'hover:shadow-glow',
          'hover:shadow-snacks',
          'dark:hover:shadow-snacks-dark',
          'bg-snacks/5',
          'dark:bg-snacks-dark/5',
        ],
      },
      intent: {
        add: ['border-dashed'],
      },
    },
    compoundVariants: [
      {
        meal: 'breakfast',
        intent: 'add',
        class: ['text-breakfast', 'dark:text-breakfast-dark'],
      },
      {
        meal: 'lunch',
        intent: 'add',
        class: ['text-lunch', 'dark:text-lunch-dark'],
      },
      {
        meal: 'dinner',
        intent: 'add',
        class: ['text-dinner', 'dark:text-dinner-dark'],
      },
      {
        meal: 'snacks',
        intent: 'add',
        class: ['text-snacks', 'dark:text-snacks-dark'],
      },
    ],
  }
);

const proteinChipUnits = cva(
  ['font-semibold', 'font-mono', 'inline-flex', 'gap-[1.5px]', 'ml-1'],
  {
    variants: {
      meal: {
        breakfast: ['text-breakfast', 'dark:text-breakfast-dark'],
        lunch: ['text-lunch', 'dark:text-lunch-dark'],
        dinner: ['text-dinner', 'dark:text-dinner-dark'],
        snacks: ['text-snacks', 'dark:text-snacks-dark'],
      },
    },
  }
);

export interface ProteinChipProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof proteinChip> {
  item: Item;
  meal: MealType;
  className?: string;
}

export interface AddButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof proteinChip> {
  meal: MealType;
  className?: string;
}

export interface ProteinChipUnitsProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof proteinChipUnits> {}

export const AddButton: React.FC<AddButtonProps> = ({
  className,
  meal,
}: AddButtonProps) => {
  return (
    <span className={proteinChip({ meal, intent: 'add', className })}>
      <Plus size={16} /> Add
    </span>
  );
};

export const ProteinChip: React.FC<ProteinChipProps> = ({
  className,
  meal,
  item,
}: ProteinChipProps) => {
  return (
    <span className={proteinChip({ meal, className })}>
      {item.food_name}{' '}
      <span className={proteinChipUnits({ meal })}>
        <span>{item.protein_grams}</span>
        <span className="opacity-70">g</span>
      </span>
    </span>
  );
};
