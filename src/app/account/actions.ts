'use server';

import { UserPreference, UserPreferences } from '@/lib/types';
import { createClient } from '@/lib/utils/supabase/server';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';

export const getPreferences = async (supabase: SupabaseClient, user: User) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select(`preference_key, preference_value`)
    .eq('user_id', user?.id)
    .returns<UserPreference[]>();

  if (error) {
    return { error: error.message, data };
  }

  const preferences = data.reduce(
    (acc: UserPreferences, { preference_key, preference_value }) => {
      acc[preference_key] = preference_value;
      return acc;
    },
    {}
  );

  return { data: preferences, error };
};

const createUpdatePreferencesFormSchema = zfd.formData({
  appearance: zfd.text(z.string().trim()),
  goal: zfd.numeric(z.number().positive()),
});

export const updatePreferences = async (
  _actionState: {
    error?: string;
    payload: { appearance: string; goal: number };
  },
  formData: FormData
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { appearance, goal } =
    createUpdatePreferencesFormSchema.parse(formData);

  // Update the user's goal
  const { data: goalData, error: goalError } = await supabase
    .from('user_preferences')
    .update({
      preference_value: goal,
    })
    .eq('user_id', user?.id)
    .eq('preference_key', 'goal')
    .select()
    .single();

  // Update the goal for today
  const { error: todaysGoalError } = await supabase.from('daily_goals').upsert({
    protein_goal_grams: goal,
    date: dayjs().format('YYYY-MM-DD'),
    user_id: user?.id,
  });

  if (todaysGoalError) {
    return {
      error: todaysGoalError.message,
      payload: { appearance: String(appearance), goal: Number(goal) },
    };
  }

  // Update the user's appearance preference
  const { data: appearanceData, error: appearanceError } = await supabase
    .from('user_preferences')
    .update({
      preference_value: { appearance },
    })
    .eq('user_id', user?.id)
    .eq('preference_key', 'appearance')
    .select()
    .single();

  if (appearanceError) {
    return {
      error: appearanceError.message,
      payload: { appearance: String(appearance), goal: Number(goal) },
    };
  }

  if (goalError) {
    return {
      error: goalError.message,
      payload: { appearance: String(appearance), goal: Number(goal) },
    };
  }

  revalidatePath('/account', 'page');

  return {
    payload: {
      appearance: appearanceData.preference_value.appearance as string,
      goal: goalData.preference_value as number,
    },
  };
};
