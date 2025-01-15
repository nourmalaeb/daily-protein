import { GroupedDailyTotal } from '@/lib/types';
import { SupabaseClient, User } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import { cache } from 'react';
import { Temporal } from 'temporal-polyfill';

export const preloadDailyTotals = (
  supabase: SupabaseClient,
  user: User,
  dateRange: string[]
) => {
  void getDailyTotals(supabase, user, dateRange);
};

export const getDailyTotals = cache(
  async (supabase: SupabaseClient, user: User, dateRange: string[]) => {
    const { data: dailyMealTotals, error: mealsError } = await supabase
      .from('meal_totals')
      .select(
        `
    date,
    meal,
    total_protein_grams,
    item_count
  `
      )
      .eq('user_id', user.id)
      .gte('date', dateRange[dateRange.length - 1])
      .lte('date', dateRange[0])
      .order('date', { ascending: false });

    const { data: dailyGoals, error: goalsError } = await supabase
      .from('daily_goals')
      .select(
        `
    date,
    protein_goal_grams`
      )
      .eq('user_id', user.id)
      .gte('date', dateRange[dateRange.length - 1])
      .lte('date', dateRange[0])
      .order('date', { ascending: false });

    // console.log({ dailyMealTotals, dailyGoals });

    if (!dailyMealTotals?.length || !dailyGoals?.length) {
      return { dailyTotals: [], errors: { mealsError, goalsError } };
    }

    const groupedDailyTotals = () => {
      const groupedDailyTotalsArray = dailyMealTotals.reduce<
        GroupedDailyTotal[]
      >((acc, cv) => {
        const { date, meal, total_protein_grams, item_count } = cv;

        // Find the existing date object in the accumulator array
        let dateObj: GroupedDailyTotal | undefined = acc.find(
          entry => entry.date === date
        );

        if (!dateObj) {
          // If the date object doesn't exist, create it
          dateObj = { date, meals: [], dailyTotal: 0 };
          acc.push(dateObj);
        }

        dateObj.dailyTotal += total_protein_grams;

        // Add the meal information in the meals array
        if (item_count > 0) {
          dateObj.meals.push({
            meal,
            total_protein_grams,
            item_count,
          });
        }
        return acc;
      }, []);

      const fullData = dailyGoals.map(
        ({ date: currentDate, protein_goal_grams }) => {
          const day = groupedDailyTotalsArray.find(
            dailyTotal => dailyTotal.date === currentDate
          );

          if (!day) {
            return {
              date: currentDate,
              isToday: Temporal.Now.plainDateISO().equals(
                Temporal.PlainDate.from(currentDate)
              ),
              meals: [],
              goal: protein_goal_grams,
            };
          }

          const { date, dailyTotal, meals } = day;
          const goal = protein_goal_grams;
          const goalMet = dailyTotal >= goal;
          const isToday = Temporal.Now.plainDateISO().equals(
            Temporal.PlainDate.from(date)
          );

          return {
            date,
            isToday,
            goal,
            dailyTotal,
            goalMet,
            meals,
          };
        }
      );

      return fullData;
    };

    return {
      dailyTotals: groupedDailyTotals(),
      errors: { mealsError, goalsError },
    };
  }
);

export const preloadEntries = (
  supabase: SupabaseClient,
  user: User,
  date: string
) => {
  void getEntries(supabase, user, date);
};

export const getEntries = cache(
  async (supabase: SupabaseClient, user: User, date: string) => {
    const { data } = await supabase
      .from('protein_entries')
      .select()
      .eq('date', date)
      .eq('user_id', user?.id);

    const { data: goalData } = await supabase
      .from('daily_goals')
      .select()
      .eq('user_id', user?.id)
      .eq('date', date)
      .single();

    const { data: dayData } = await supabase
      .from('daily_totals')
      .select()
      .eq('user_id', user?.id)
      .eq('date', date)
      .single();

    return { data, goalData, dayData };
  }
);
