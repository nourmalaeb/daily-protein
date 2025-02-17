'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  createEntries,
  CreateEntriesActionState,
} from '@/app/on/[date]/actions';
import { Button } from '@/components/buttonLink';
import { Input } from '@/components/controlledInput';
import { MealPicker } from '@/components/mealPicker';
import { Trash2, X } from 'lucide-react';
import { useActionState, useState } from 'react';
import { AddButton } from './proteinChip';
import { MealType } from '@/lib/types';
import { useProteinStore } from '@/providers/protein-provider';
import { SubmitButton } from './submitButton';
import useSound from 'use-sound';

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

  // const [state, createEntriesAction, isPending] = useActionState(
  //   createEntriesWithDate,
  //   {
  //     errors: undefined,
  //     success: false,
  //     data: undefined,
  //   }
  // );

  const resetAndClose = () => {
    setItems([{ index: 0, name: '', protes: undefined }]);
    setOpen(false);
  };

  const { addEntry } = useProteinStore(state => state);

  // useEffect(() => {
  //   if (state.success) {
  //     resetAndClose();
  //   }
  // }, [state]);

  // const handleSubmit = async (formData: FormData) => {
  //   // Run both the server action and store update
  //   const result = await createEntriesAction(formData);

  //   console.log(result);

  //   if (state.success) {
  //     // Handle success
  //     console.log(result);
  //     result.data?.forEach(item => {
  //       addEntry(item);
  //     });
  //     console.log('Form submitted and state updated!');
  //     resetAndClose();
  //   }
  // };
  const initialState = { success: false, data: [], error: null };

  const [state, formAction] = useActionState(
    async (prevState: CreateEntriesActionState, formData: FormData) => {
      const result = await createEntriesWithDate(prevState, formData);
      console.log(state, result);

      if (result.success) {
        // Handle success
        console.log(result);
        result.data?.forEach(item => {
          addEntry(item);
        });
        console.log('Form submitted and state updated!');
        resetAndClose();
      }

      return result;
    },
    initialState
  );

  const [boopSound] = useSound('/sounds/boop.wav', { volume: 0.5 });
  const [cancelSound] = useSound('/sounds/cancel.wav', { volume: 0.5 });

  return (
    <DialogPrimitive.Root
      modal
      open={open}
      onOpenChange={e => (e ? setOpen(e) : resetAndClose())}
    >
      <DialogPrimitive.Trigger onMouseDown={() => boopSound()}>
        <AddButton meal={meal} />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-shadow/30 dark:bg-shadow-dark/30 fixed inset-0 transition backdrop-blur-[8px] data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-hide" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          key="addItem"
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
                  onMouseDown={() => cancelSound()}
                >
                  <X size={16} />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Title>
          <form action={formAction} className="flex flex-col gap-4 px-4 pb-4">
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
                    autoFocus={index === items[items.length - 1].index}
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
                    className="col-span-1 px-1!"
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
                onClick={resetAndClose}
                className="grow w-1/2"
                onMouseDown={() => cancelSound()}
              >
                Cancel
              </Button>
              <SubmitButton label="Save" />
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
