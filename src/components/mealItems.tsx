import { MealItemsProps, MealType } from '@/lib/types';
import AddEntryModal from './addEntryForm';
import EditEntryModal from './editEntryForm';
import * as motion from 'motion/react-client';

const MealItems = ({ category, items, date }: MealItemsProps) => {
  const total = items
    ? items.reduce((acc, item) => acc + (item.protein_grams || 0), 0)
    : 0;

  const listVariants = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    hidden: { opacity: 0 },
  };

  const listItemVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
      },
    },
    hidden: { opacity: 0, x: -4 },
  };

  return (
    <div className="flex flex-col items-stretch gap-1 p-4">
      <div className="flex flex-row gap-2 items-center">
        <h3 className="uppercase text-xs font-semibold tracking-widest">
          {category}
        </h3>
        <div className="grow h-px bg-zinc-500" />
        <span className="text-sm font-medium font-mono inline-flex gap-0.5">
          <span>{total}</span>
          <span className="opacity-70">g</span>
        </span>
      </div>
      <motion.div
        className="flex flex-row gap-1 flex-wrap"
        transition={{ staggerChildren: 1 }}
        initial="hidden"
        animate="visible"
        variants={listVariants}
      >
        {items &&
          items.map(item => (
            <motion.div key={item.entry_id} variants={listItemVariants}>
              <EditEntryModal
                item={item}
                meal={category as MealType}
                date={date}
              />
            </motion.div>
          ))}

        <motion.div variants={listItemVariants}>
          <AddEntryModal meal={category as MealType} date={date} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MealItems;
