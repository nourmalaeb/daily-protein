import { observable } from '@legendapp/state';
import {
  configureSyncedSupabase,
  syncedSupabase,
} from '@legendapp/state/sync-plugins/supabase';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import { createClient } from './client';
import { randomUUID } from 'crypto';

const supabase = createClient();

const generateId = () => randomUUID();
configureSyncedSupabase({
  generateId,
});

const user_id = '';

export const entries$ = observable(
  syncedSupabase({
    supabase,
    collection: 'protein_entries',
    // select: from =>
    //   from.select('entry_id, date, food_name, meal, protein_grams'),
    filter: select => select.eq('user_id', user_id),
    actions: ['read', 'create', 'update', 'delete'],
    persist: {
      name: 'entries',
      plugin: ObservablePersistLocalStorage,
      retrySync: true,
    },
    // changesSince: 'last-sync',
  })
);
