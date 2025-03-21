'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  deleteEntryById,
  editEntryById,
  UpdateEntriesActionState,
} from '@/app/on/[date]/actions';
import { Button } from '@/components/buttonLink';
import { Input } from '@/components/controlledInput';
import { MealPicker } from '@/components/mealPicker';
import { Item, MealType } from '@/lib/types';
import { Trash2, TriangleAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useActionState, useRef, useState } from 'react';
import { ProteinChip } from './proteinChip';
import { useProteinStore } from '@/providers/protein-provider';
import useSound from 'use-sound';

export default function EditEntryModal({
  meal,
  item,
}: {
  meal: MealType;
  item: Item;
}) {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const [, editEntriesAction, isPending] = useActionState(
    async (prevState: UpdateEntriesActionState, formData: FormData) => {
      const result = await editEntryById(prevState, formData);
      if (result.success && result.data) {
        // Handle success
        updateEntry(result.data);
        // console.log('Form submitted and state updated!');
        setOpen(false);
      }
      return result;
    },
    {
      errors: '',
      success: false,
      data: undefined,
    }
  );

  const { updateEntry, deleteEntry } = useProteinStore(state => state);

  const handleDeleteAction = async (formData: FormData) => {
    console.log('DELETING');
    // Run both the server action and store update
    const result = await deleteEntryById(formData);

    if (result.success) {
      // Handle success
      console.log('Form submitted and state updated!');
      await deleteEntry(Number(formData.get('id')));
      console.log('Form submitted and state updated!');
      setOpen(false);
      setShowConfirm(false);
    }
  };

  const [boopSound] = useSound('/sounds/boop.wav', {
    playbackRate: 1.25,
  });
  const [cancelSound] = useSound('/sounds/snikt.wav', { volume: 0.5 });
  const [updateSound] = useSound('/sounds/diamond.wav', { volume: 0.5 });
  const [errorSound] = useSound('/sounds/cancel.wav', { volume: 0.5 });

  return (
    <DialogPrimitive.Root modal open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger onPointerDown={() => boopSound()}>
        <ProteinChip item={item} meal={meal} />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-shadow/30 dark:bg-shadow-dark/30 fixed inset-0 transition backdrop-blur-[8px] data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-hide" />
        <DialogPrimitive.Content
          key={`edit-${item.entry_id}`}
          aria-describedby={undefined}
          className="bg-background dark:bg-background-dark fixed overflow-y-scroll
                    transform left-1/2 -translate-x-1/2 top-16
                    w-11/12 max-w-sm max-h-1/2-screen
                    border border-highlight dark:border-highlight-dark rounded-xl shadow-xl
            transition data-[state=open]:animate-modal-content-show data-[state=closed]:animate-modal-content-hide"
        >
          <DialogPrimitive.Title asChild>
            <div className="flex justify-between p-4 bg-background dark:bg-background-dark sticky top-0 z-10">
              <h2 className="font-bold text-xl tracking-tight">Add items</h2>
              <DialogPrimitive.Close asChild>
                <Button
                  area-label="Close"
                  size={'small'}
                  className="px-1 py-1"
                  onPointerDown={() => cancelSound()}
                >
                  <X size={16} />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Title>
          <form
            action={editEntriesAction}
            className="flex flex-col gap-4 px-4 pb-4"
            ref={formRef}
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
                onPointerDown={() => cancelSound()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                intent={'primary'}
                className="grow w-1/2"
                disabled={isPending}
                onPointerDown={() =>
                  formRef.current?.checkValidity()
                    ? updateSound()
                    : errorSound()
                }
              >
                {isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
            <AnimatePresence>
              {showConfirm && (
                <motion.div
                  className="isolate fixed inset-0 bg-shadow/50 dark:bg-shadow-dark/50 backdrop-blur-xs z-50"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 inset-x-2 bg-background/50 dark:bg-background-dark/70 rounded-lg flex flex-col gap-4 items-center justify-between transition backdrop-blur-lg animate-overlayShow p-6 text-center border border-highlight dark:border-highlight-dark shadow-xl">
                    <div className="flex items-center gap-2 w-full text-left">
                      <TriangleAlert className="w-4" strokeWidth={2.5} />
                      <h3 className="font-semibold">
                        Permanently delete this item?
                      </h3>
                    </div>
                    <p className="flex gap-1 w-full text-left">
                      <span className="px-2 py-1 bg-highlight/75 dark:bg-highlight-dark/75 rounded-md grow">
                        {item.food_name}
                      </span>
                      <span className="font-mono px-2 py-1 bg-highlight/75 dark:bg-highlight-dark/75 rounded-md flex gap-0.5">
                        {item.protein_grams}
                        <span className="opacity-70">g</span>
                      </span>
                    </p>
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
                        formAction={handleDeleteAction}
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
