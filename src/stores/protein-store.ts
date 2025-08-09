import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';
import { createClient } from '@/lib/utils/supabase/client';
import { MealType } from '@/lib/types';
import { daysFromEntries, fetchInitialState } from '@/lib/utils';
import { Tables } from '../../database.types';
import { Id } from '../../convex/_generated/dataModel';

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
  _id: Id<'protein_entries'>;
  protein_grams: number;
  meal: MealType;
  date: string;
};

export type EntryTypeSupa = {
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
  days: Array<DayDataType>;
  currentDay?: DayDataType;
  preferences: Tables<'user_preferences'>[];
  _hasHydrated?: boolean;
};

export type ProteinActions = {
  setCurrentDay: (date: string) => void;
  fetchEntries: () => void;
  addEntry: (entry: EntryType) => void;
  updateEntry: (entry: EntryType) => void;
  deleteEntry: (id: number) => void;
  updateGoal: (goal: DailyGoalType) => void;
  updatePreference: (preferences: Tables<'user_preferences'>) => void;
  setHasHydrated: (b: boolean) => void;
};

export type ProteinStore = ProteinState & ProteinActions;

export const defaultProteinState: ProteinState = {
  entries: [],
  goals: [],
  days: [],
  currentDay: undefined,
  preferences: [],
  _hasHydrated: false,
};

export const createProteinStore = (initialState = defaultProteinState) => {
  return createStore<ProteinStore>()(
    persist(
      immer(set => ({
        ...initialState,
        setCurrentDay: (date: string) =>
          set(
            produce(state => {
              state.currentDay = state.days.find(
                (day: DayDataType) => day.date === date
              );
            })
          ),
        fetchEntries: async () => {
          const supabase = await createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            console.log('no user - fetchEntries');
            return;
          }
          const initialState = await fetchInitialState(supabase, user);
          // console.log('fetched state', { initialState });
          set(initialState);
        },
        addEntry: (entry: EntryType) =>
          set(
            produce(state => {
              state.entries.push(entry);
              state.days = daysFromEntries(state.entries, state.goals);
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
                state.days = daysFromEntries(state.entries, state.goals);
              }
            })
          ),
        deleteEntry: (id: number) =>
          set(
            produce(state => {
              state.entries = state.entries.filter(
                (e: EntryType) => e.entry_id !== id
              );
              state.days = daysFromEntries(state.entries, state.goals);
            })
          ),
        updateGoal: (goal: DailyGoalType) =>
          set(
            produce(state => {
              const goalToUpdate = state.goals.find(
                (g: DailyGoalType) => g.date === goal.date
              );
              if (goalToUpdate) {
                goalToUpdate.protein_goal_grams = goal.protein_goal_grams;
                state.days = daysFromEntries(state.entries, state.goals);
              }
            })
          ),
        updatePreference: (preferences: Tables<'user_preferences'>) =>
          set(
            produce(state => {
              const preferenceToUpdate = state.preferences.find(
                (p: Tables<'user_preferences'>) =>
                  p.preference_key === preferences.preference_key
              );
              if (preferenceToUpdate) {
                preferenceToUpdate.preference_value =
                  preferences.preference_value;
                preferenceToUpdate.updated_at = preferences.updated_at;
              }
            })
          ),
        _hasHydrated: false,
        setHasHydrated: (b: boolean) => {
          set({
            _hasHydrated: b,
          });
        },
      })),
      {
        name: 'protein-storage',
        onRehydrateStorage: state => {
          console.log('onRehydrateStorage');
          state.fetchEntries();
          return () => state.setHasHydrated(true);
        },
      }
    )
  );
};
