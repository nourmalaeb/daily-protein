import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';
import { getAllEntries, getDailyGoals } from '@/lib/utils/supabase/queries';
import { createClient } from '@/lib/utils/supabase/client';
import { MealType } from '@/lib/types';

export type DayDataType = {
  date: string;
  meals: Array<MealDataType>;
  goal: number;
  dailyTotal: number;
  goalMet: boolean;
  isToday: boolean;
};

export type MealDataType = {
  meal: MealType;
  total_protein_grams: number;
  items: Array<EntryType>;
};

export type EntryType = {
  food_name: string;
  entry_id: number;
  protein_grams: number;
  meal: MealType;
  date: string;
};

export type DailyGoalType = {
  date: string;
  protein_goal_grams: number;
};

export type ProteinState = {
  entries: Array<EntryType>;
  goals: Array<DailyGoalType>;
};

export type ProteinActions = {
  fetchEntries: () => void;
  addEntry: (entry: EntryType) => void;
  updateEntry: (entry: EntryType) => void;
  deleteEntry: (id: number) => void;
  // getDay: (date: string) => void;
  // addDay: (day: DayDataType) => void;
  // updateDay: (day: DayDataType) => void;
};

export type ProteinStore = ProteinState & ProteinActions;

export const defaultProteinState: ProteinState = {
  entries: [],
  goals: [],
};

export const createProteinStore = () => {
  return createStore<ProteinStore>()(
    persist(
      immer(set => ({
        entries: [],
        goals: [],
        fetchEntries: async () => {
          const supabase = await createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            console.log('no user - fetchEntries');
            return;
          }
          const { data: entriesData } = await getAllEntries(supabase, user);
          if (!entriesData) {
            console.log('no entries data - fetchEntries');
          }
          const { data: goalsData } = await getDailyGoals(supabase, user);
          if (!goalsData) {
            console.log('no goals data - fetchEntries');
          }
          const goals = goalsData || [];
          const entries = entriesData || [];
          console.log('fetched state', { entries, goals });
          set({ entries, goals });
        },
        addEntry: (entry: EntryType) =>
          set(
            produce(state => {
              state.entries.push(entry);
            })
          ),
        updateEntry: (entry: EntryType) =>
          set(
            produce(state => {
              const entryToUpdate = state.entries.find(
                (e: EntryType) => e.entry_id === entry.entry_id
              );
              if (entryToUpdate) {
                entryToUpdate.food_name = entry.food_name;
                entryToUpdate.protein_grams = entry.protein_grams;
                entryToUpdate.meal = entry.meal;
                entryToUpdate.date = entry.date;
              }
            })
          ),
        deleteEntry: (id: number) =>
          set(
            produce(state => {
              state.entries = state.entries.filter(
                (e: EntryType) => e.entry_id !== id
              );
            })
          ),
      })),
      { name: 'protein-storage' }
    )
  );
};
