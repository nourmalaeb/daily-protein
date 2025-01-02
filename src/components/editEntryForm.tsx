'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { deleteEntryById, editEntryById } from '@/app/on/[date]/actions';
import { Button } from '@/components/button';
import { Input } from '@/components/controlledInput';
import { MealPicker } from '@/components/mealPicker';
import { Item, MealType } from '@/lib/types';
import { Trash2, TriangleAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useActionState, useEffect, useState } from 'react';
import { ProteinChip } from './proteinChip';

export default function EditEntryModal({
  meal,
  date,
  item,
}: {
  meal: MealType;
  date: string;
  item: Item;
}) {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const editEntryByIdWithDate = editEntryById.bind(null, date);
  const deleteEntryByIdWithDate = deleteEntryById.bind(null, date);

  const [state, editEntriesAction, isPending] = useActionState(
    editEntryByIdWithDate,
    {
      errors: undefined,
      success: false,
    }
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <DialogPrimitive.Root modal open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger>
        <ProteinChip item={item} meal={meal} />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-shadow/30 dark:bg-shadow-dark/30 fixed inset-0 transition backdrop-blur-[8px] data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-hide" />
        <DialogPrimitive.Content
          className="bg-background dark:bg-background-dark fixed overflow-y-scroll
                    transform left-1/2 -translate-x-1/2 top-16
                    w-11/12 max-w-sm max-h-1/2-screen
                    border border-highlight dark:border-highlight-dark rounded-xl shadow-xl
            transition data-[state=open]:animate-modal-content-show data-[state=closed]:animate-modal-content-hide"
        >
          <DialogPrimitive.Title asChild>
            <div className="flex justify-between p-4 bg-background dar:bg-background-dark sticky top-0 z-10">
              <h2 className="font-bold text-xl tracking-tight">Add items</h2>
              <DialogPrimitive.Close asChild>
                <Button area-label="Close" size={'small'} className="px-1 py-1">
                  <X size={16} />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Title>
          <form
            action={editEntriesAction}
            className="flex flex-col gap-4 px-4 pb-4"
          >
            <MealPicker mealValue={meal || 'breakfast'} />
            <div className="grid grid-cols-10 gap-1">
              <span className="col-span-7 uppercase text-xs font-semibold tracking-widest opacity-80">
                Item
              </span>
              <span className="cal-span-3 uppercase text-xs font-semibold tracking-widest opacity-80">
                Amount
              </span>

              <Input
                name="id"
                initialValue={String(item.entry_id)}
                className="hidden"
              />
              <Input
                name="item"
                initialValue={item.food_name}
                // placeholder="Item name"
                className="col-span-7"
                required
              />
              <Input
                type="number"
                name="amount"
                initialValue={String(item.protein_grams)}
                className="col-span-2 font-mono"
                required
                min={0}
                step={1}
                autoFocus
              />
              <Button
                className="col-span-1 px-1!"
                value="delete"
                onClick={() => setShowConfirm(true)}
              >
                <Trash2 className="w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                intent={'destructive'}
                onClick={() => setOpen(false)}
                className="grow w-1/2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                intent={'primary'}
                className="grow w-1/2"
                disabled={isPending}
              >
                {isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
            <AnimatePresence>
              {showConfirm && (
                <motion.div
                  className="isolate fixed inset-0 bg-shadow/50 backdrop-blur-xs z-50"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 inset-x-2 bg-highlight/50 dark:bg-highlight-dark/50 rounded-lg flex flex-col gap-4 items-center justify-between transition backdrop-blur-lg animate-overlayShow p-6 text-center border border-highlight shadow-xl">
                    <div className="flex items-center gap-2 w-full text-left">
                      <TriangleAlert className="w-4" strokeWidth={2.5} />
                      <h3 className="font-semibold">
                        Permanently delete this item?
                      </h3>
                    </div>
                    <div className="flex gap-1 w-full text-left">
                      <span className="px-2 py-1 bg-highlight/75 dark:bg-highlight-dark/75 rounded-md grow">
                        {item.food_name}
                      </span>
                      <span className="px-2 py-1 bg-highlight/75 dark:bg-highlight-dark/75 rounded-md flex gap-0.5">
                        <span className="font-mono">{item.protein_grams}</span>
                        <span className="opacity-70">g</span>
                      </span>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button
                        className="w-1/2"
                        onClick={() => setShowConfirm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        value="delete"
                        intent="destructive"
                        filled
                        className="w-1/2"
                        formAction={deleteEntryByIdWithDate}
                      >
                        Delete item
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
