import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../database.types';
import { Id } from '../../../convex/_generated/dataModel';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface ItemType {
  food_name: string;
  entry_id: number;
  protein_grams: number;
  meal: MealType;
}

export type Item = {
  _id: Id<'protein_entries'>;
  food_name: string;
  protein_grams: number;
  meal?: string;
};

export type MealItemsProps = {
  items?: Item[];
  category: string;
  date: string;
};

export interface DailyTotal {
  date: string;
  meal: string;
  total_protein_grams: number;
  item_count: number;
}

export interface MealData {
  meal: string;
  total_protein_grams: number;
  item_count: number;
}

export interface GroupedDailyTotal {
  date: string;
  dailyTotal: number;
  meals: MealData[];
}

// Define the type for a JSON value
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }
  | undefined;

// Define the type for the key-value pair
export interface UserPreference {
  preference_key: string;
  preference_value: JSONValue;
}

export interface UserPreferences {
  [key: string]: JSONValue;
  appearance?: { appearance: string };
  goal?: number;
}

// Typed Supabase Client for legend state
export type TypedSupabaseClient = SupabaseClient<Database>;
