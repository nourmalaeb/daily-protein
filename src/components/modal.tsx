'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function Modal({
  rootId,
  isOpen,
  children,
}: {
  rootId: string;
  isOpen?: boolean;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return createPortal(
    <dialog ref={dialogRef} className="backdrop:bg-transparent text-foreground">
      <div
        className="bg-shadow/30 dark:bg-shadow-dark/30 fixed inset-0 transition backdrop-blur-[8px] animate-overlayShow"
        onClick={() => dialogRef.current?.close()}
      />
      <div
        className="bg-background dark:bg-background-dark fixed transform overflow-hidden
             left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
             p-4 border border-highlight dark:border-highlight-dark rounded-xl shadow-xl
             w-11/12 max-w-sm
             flex flex-col gap-4 items-stretch
             transition animate-modalContentShow"
      >
        {children}
      </div>
    </dialog>,
    document.getElementById(rootId)!
  );
}
