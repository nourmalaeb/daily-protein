import { DailyGoalType, DayDataType, EntryType } from '@/stores/protein-store';
import { Item, MealType } from '../types';
import { Temporal } from 'temporal-polyfill';
import { SupabaseClient, User } from '@supabase/supabase-js';
import {
  getAllEntries,
  getDailyGoals,
  getUserPreferences,
} from './supabase/queries';
import { Tables } from '../../../database.types';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const itemsParser = (items: Item[]) => {
  const breakfastItems = items.filter(i => i.meal === 'breakfast');
  const lunchItems = items.filter(i => i.meal === 'lunch');
  const dinnerItems = items.filter(i => i.meal === 'dinner');
  const snacksItems = items.filter(i => i.meal === 'snacks');

  const stats = {
    breakfast: breakfastItems.reduce((a, cv) => a + cv.protein_grams, 0),
    lunch: lunchItems.reduce((a, cv) => a + cv.protein_grams, 0),
    dinner: dinnerItems.reduce((a, cv) => a + cv.protein_grams, 0),
    snacks: snacksItems.reduce((a, cv) => a + cv.protein_grams, 0),
  };

  return {
    breakfastItems,
    lunchItems,
    dinnerItems,
    snacksItems,
    stats,
  };
};

export const formToJSON = (elem: FormData) => {
  const output: {
    [key: string]: string[];
  } = {};
  elem.forEach((value, key) => {
    // Check if property already exist
    if (Object.prototype.hasOwnProperty.call(output, key)) {
      let current = output[key];
      if (!current) return;
      if (!Array.isArray(current)) {
        // If it's not an array, convert it to an array.
        current = output[key] = [current];
      }
      current.push(value.toString()); // Add the new value to the array.
    } else {
      output[key] = [value.toString()];
    }
  });
  return output;
};

export const distanceBetween = (
  pointA: { x: number; y: number },
  pointB: { x: number; y: number }
) => {
  return Math.sqrt(
    (pointA.x - pointB.x) * (pointA.x - pointB.x) +
      (pointA.y - pointB.y) * (pointA.y - pointB.y)
  );
};

export const today = (timezone?: string) => {
  let date;
  if (timezone) {
    date = Temporal.Now.plainDateISO(timezone).toString();
  } else if (typeof window !== 'undefined') {
    const now = new window.Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    date = new Temporal.PlainDate(year, month, day).toString();
  } else {
    date = Temporal.Now.plainDateISO().toString();
  }

  return date;
};

const mealFromItems = (items: EntryType[]) => ({
  meal: items[0]?.meal,
  total_protein_grams: items.reduce((a, cv) => a + cv.protein_grams, 0),
  items,
});

export const daysFromEntries = (
  entries: EntryType[],
  goals: DailyGoalType[]
): DayDataType[] => {
  const days = goals.map(goal => {
    const dateObj = Temporal.PlainDate.from(goal.date);
    const dayEntries = entries.filter(e => e.date === goal.date);
    const total_protein_grams = dayEntries.reduce(
      (a, cv) => a + cv.protein_grams,
      0
    );
    const breakfastItems = dayEntries.filter(i => i.meal === 'breakfast');
    const lunchItems = dayEntries.filter(i => i.meal === 'lunch');
    const dinnerItems = dayEntries.filter(i => i.meal === 'dinner');
    const snacksItems = dayEntries.filter(i => i.meal === 'snacks');

    const meals = [
      { ...mealFromItems(breakfastItems), meal: 'breakfast' as MealType },
      { ...mealFromItems(lunchItems), meal: 'lunch' as MealType },
      { ...mealFromItems(dinnerItems), meal: 'dinner' as MealType },
      { ...mealFromItems(snacksItems), meal: 'snacks' as MealType },
    ];
    return {
      date: dateObj.toString(),
      isToday: Temporal.Now.plainDateISO().equals(dateObj),
      dailyTotal: total_protein_grams,
      goal: goal.protein_goal_grams,
      goalMet: total_protein_grams >= goal.protein_goal_grams,
      meals,
    };
  });

  return days.sort((a, b) => b.date.localeCompare(a.date));
};

export const fetchInitialState = async (
  supabase: SupabaseClient,
  user: User
): Promise<{
  entries: EntryType[];
  goals: DailyGoalType[];
  days: DayDataType[];
  preferences: Tables<'user_preferences'>[];
}> => {
  const { data: entriesData } = await getAllEntries(supabase, user);
  if (!entriesData) {
    console.log('no entries data - fetchEntries');
  }
  const { data: goalsData } = await getDailyGoals(supabase, user);
  if (!goalsData) {
    console.log('no goals data - fetchEntries');
  }
  const { data: preferencesData } = await getUserPreferences(supabase, user);
  if (!preferencesData) {
    console.log('no preferences data - fetchEntries');
  }
  const goals = goalsData || [];
  const entries = entriesData || [];
  const preferences = preferencesData || [];
  const days = daysFromEntries(entries, goals);
  // console.log('fetched state', { entries, goals, days, preferences });
  return { entries, goals, days, preferences };
};

// MERGE CLASSES

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// DAYS TO WEEKS

export const daysToWeeks = (days: DayDataType[]) => {
  let weeks = [];
  const latestDay = Temporal.PlainDate.from(days[0].date);
  const dayOfWeek = latestDay.dayOfWeek;
  const firstWeek = days.slice(0, dayOfWeek);
  weeks.push(firstWeek);

  for (let i = dayOfWeek; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
};
