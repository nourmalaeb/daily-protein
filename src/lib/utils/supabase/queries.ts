import { GroupedDailyTotal } from '@/lib/types';
import { SupabaseClient, User } from '@supabase/supabase-js';
import dayjs from 'dayjs';

export const getDailyTotals = async (
  supabase: SupabaseClient,
  user: User,
  dateRange: string[]
) => {
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

  if (!dailyMealTotals?.length || !dailyGoals?.length) {
    return { dailyTotals: [], errors: { mealsError, goalsError } };
  }

  const groupedDailyTotals = () => {
    const groupedDailyTotalsArray = dailyMealTotals.reduce<GroupedDailyTotal[]>(
      (acc, cv) => {
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
        dateObj.meals.push({
          meal,
          total_protein_grams,
          item_count,
        });
        return acc;
      },
      []
    );

    const fullData = dailyGoals.map(
      ({ date: currentDate, protein_goal_grams }) => {
        const day = groupedDailyTotalsArray.find(
          dailyTotal => dailyTotal.date === currentDate
        );

        if (!day) {
          return {
            date: currentDate,
            isToday: dayjs(currentDate).isSame(dayjs(), 'day'),
            meals: [],
          };
        }

        const { date, dailyTotal, meals } = day;
        const goal = protein_goal_grams;
        const goalMet = dailyTotal >= goal;
        const isToday = dayjs(date).isSame(dayjs(), 'day');

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
};
