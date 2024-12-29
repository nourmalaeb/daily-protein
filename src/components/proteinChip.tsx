import { Item, MealType } from '@/lib/types';
import { cva, type VariantProps } from 'class-variance-authority';
import { Plus } from 'lucide-react';

const proteinChip = cva(
  [
    'select-none',
    'font-medium',
    'rounded-md',
    'border',
    'bg-transparent',
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
          'hover:bg-breakfast/10',
          'hover:shadow-glow',
          'hover:shadow-breakfast',
          'bg-breakfast/5',
        ],
        lunch: [
          'border-lunch',
          'hover:bg-lunch/10',
          'hover:shadow-glow',
          'hover:shadow-lunch',
          'bg-lunch/5',
        ],
        dinner: [
          'border-dinner',
          'hover:bg-dinner/10',
          'hover:shadow-glow',
          'hover:shadow-dinner',
          'bg-dinner/5',
        ],
        snacks: [
          'border-snacks',
          'hover:bg-snacks/10',
          'hover:shadow-glow',
          'hover:shadow-snacks',
          'bg-snacks/5',
        ],
      },
      intent: {
        add: ['border-dashed'],
      },
    },
    compoundVariants: [
      { meal: 'breakfast', intent: 'add', class: ['text-breakfast'] },
      { meal: 'lunch', intent: 'add', class: ['text-lunch'] },
      { meal: 'dinner', intent: 'add', class: ['text-dinner'] },
      { meal: 'snacks', intent: 'add', class: ['text-snacks'] },
    ],
  }
);

const proteinChipUnits = cva(
  ['font-semibold', 'font-mono', 'inline-flex', 'gap-[1.5px]', 'ml-1'],
  {
    variants: {
      meal: {
        breakfast: ['text-breakfast'],
        lunch: ['text-lunch'],
        dinner: ['text-dinner'],
        snacks: ['text-snacks'],
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
