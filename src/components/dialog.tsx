'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Button } from './button';

export const Dialog = forwardRef(
  ({ children, trigger, close, title, ...props }, forwardedRef) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <DialogPrimitive.Root modal open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="bg-shadow/30 fixed inset-0 transition backdrop-blur-[8px] animate-overlayShow" />
          <DialogPrimitive.Content
            {...props}
            ref={forwardedRef}
            aria-describedby={undefined}
            className="bg-background fixed transform overflow-hidden
             left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
             p-4 border border-highlight rounded-xl shadow-xl
             w-11/12 max-w-sm
             flex flex-col gap-4 items-stretch
             transition animate-modalContentShow"
          >
            <DialogPrimitive.Title asChild>
              <h3 className="font-bold text-xl tracking-tight">{title}</h3>
            </DialogPrimitive.Title>
            {children}
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
);

Dialog.displayName = 'Dialog';
