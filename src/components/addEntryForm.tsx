'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { createEntries } from '@/app/on/[date]/actions';
import { Button } from '@/components/button';
import { Input } from '@/components/controlledInput';
import { MealPicker } from '@/components/mealPicker';
import { Trash2, X } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { AddButton } from './proteinChip';
import { MealType } from '@/lib/types';

export default function AddEntryModal({
  meal,
  date,
}: {
  meal: MealType;
  date: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { index: 0, name: '', protes: undefined },
  ]);

  const createEntriesWithDate = createEntries.bind(null, date);

  const [state, createEntriesAction, isPending] = useActionState(
    createEntriesWithDate,
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
        <AddButton meal={meal} />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-shadow/30 fixed inset-0 transition backdrop-blur-[8px] animate-overlayShow" />
        <DialogPrimitive.Content
          className="bg-background fixed transform overflow-hidden
             left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
             p-4 border border-highlight rounded-xl shadow-xl
             w-11/12 max-w-sm
             flex flex-col gap-4 items-stretch
             transition animate-modalContentShow"
        >
          <DialogPrimitive.Title asChild>
            <h3 className="font-bold text-xl tracking-tight">Add items</h3>
          </DialogPrimitive.Title>
          <form action={createEntriesAction} className="flex flex-col gap-4">
            <MealPicker mealValue={meal || 'breakfast'} />
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-10 gap-1">
                <span className="col-span-7 uppercase text-xs font-semibold tracking-widest opacity-80">
                  Item
                </span>
                <span className="cal-span-3 uppercase text-xs font-semibold tracking-widest opacity-80">
                  Amount
                </span>
              </div>
              {items.map(({ index }) => (
                <div className="grid grid-cols-10 gap-1" key={index}>
                  <Input
                    name={`item`}
                    className="col-span-7"
                    required
                    autoFocus={index === 0}
                  />
                  <Input
                    type="number"
                    name={`amount`}
                    className="col-span-2 font-mono"
                    required
                    min={0}
                    step={1}
                  />
                  <Button
                    className="col-span-1 !px-1"
                    onClick={() =>
                      setItems(items => items.filter(i => i.index !== index))
                    }
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={() =>
                setItems(items => [
                  ...items,
                  {
                    index: items[items.length - 1].index + 1,
                    name: '',
                    protes: undefined,
                  },
                ])
              }
            >
              Add another item
            </Button>
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
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
          <DialogPrimitive.Close asChild>
            <Button
              area-label="Close"
              size={'small'}
              className="absolute top-2 right-2 px-1 py-1"
            >
              <X size={16} />
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
