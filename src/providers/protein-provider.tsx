'use client';

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useEffect,
} from 'react';
import { useStore } from 'zustand';

import { type ProteinStore, createProteinStore } from '@/stores/protein-store';
import { fetchInitialState } from '@/lib/utils';
import { createClient } from '@/lib/utils/supabase/client';

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
  const storeRef = useRef<ProteinStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createProteinStore();
  }

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.log('no user - fetchEntries');
        return;
      }
      const state = await fetchInitialState(supabase, user);

      storeRef.current = createProteinStore(state);
    };

    fetchData();
  }, []);

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
