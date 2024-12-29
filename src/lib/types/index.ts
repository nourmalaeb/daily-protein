export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface ItemType {
  food_name: string;
  entry_id: number;
  protein_grams: number;
  meal: MealType;
}

export type Item = {
  entry_id: number;
  food_name: string;
  protein_grams: number;
  meal?: string;
};

export type MealItemsProps = {
  items?: Item[];
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
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
