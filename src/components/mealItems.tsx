import { MealItemsProps } from '@/lib/types';
import AddEntryModal from './addEntryForm';
import EditEntryModal from './editEntryForm';

const MealItems = ({ category, items, date }: MealItemsProps) => {
  const total = items
    ? items.reduce((acc, item) => acc + (item.protein_grams || 0), 0)
    : 0;
  return (
    <div className="flex flex-col items-stretch gap-1 p-4 ">
      <div className="flex flex-row gap-2 items-center">
        <h3 className="uppercase text-xs font-semibold tracking-widest">
          {category}
        </h3>
        <div className="grow h-px bg-slate-500" />
        <span className="text-sm font-medium font-mono inline-flex gap-0.5">
          <span>{total}</span>
          <span className="opacity-70">g</span>
        </span>
      </div>
      <div className="flex flex-row gap-1 flex-wrap">
        {items &&
          items.map(item => (
            <EditEntryModal
              item={item}
              meal={category}
              date={date}
              key={item.entry_id}
            />
          ))}
        <AddEntryModal meal={category} date={date} />
      </div>
    </div>
  );
};

export default MealItems;
