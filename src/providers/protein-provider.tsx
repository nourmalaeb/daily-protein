// src/providers/counter-store-provider.tsx
'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import { type ProteinStore, createProteinStore } from '@/stores/protein-store';

export type ProteinStoreApi = ReturnType<typeof createProteinStore>;

export const ProteinStoreContext = createContext<ProteinStoreApi | undefined>(
  undefined
);

export interface ProteinStoreProviderProps {
  children: ReactNode;
}

export const ProteinStoreProvider = ({
  children,
}: ProteinStoreProviderProps) => {
  const storeRef = useRef<ProteinStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createProteinStore();
  }

  return (
    <ProteinStoreContext.Provider value={storeRef.current}>
      {children}
    </ProteinStoreContext.Provider>
  );
};

export const useProteinStore = <T,>(
  selector: (store: ProteinStore) => T
): T => {
  const proteinStoreContext = useContext(ProteinStoreContext);

  if (!proteinStoreContext) {
    throw new Error(`useProteinStore must be used within proteinStoreProvider`);
  }

  return useStore(proteinStoreContext, selector);
};
