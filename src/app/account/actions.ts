'use server';

import { UserPreference, UserPreferences } from '@/lib/types';
import { createClient } from '@/lib/utils/supabase/server';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Tables } from '../../../database.types';
import { Temporal } from 'temporal-polyfill';

export const getPreferences = async (
  supabase: SupabaseClient,
  user: User | null
) => {
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
  goal: zfd.numeric(z.number().positive()),
  date: zfd.text(z.string().trim()),
});

export const createGoalPreference = async (
  _actionState: {
    error?: string;
    payload: { goal?: number };
  },
  formData: FormData
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: 'User not found',
      payload: { goal: Number(formData.get('goal')) },
    };
  }

  const { goal, date } = createUpdatePreferencesFormSchema.parse(formData);

  // Create the user's goal
  const { error: goalError } = await supabase.from('user_preferences').insert({
    preference_key: 'goal',
    preference_value: goal,
    user_id: user?.id,
  });

  if (goalError) {
    return {
      error: 'Goal Error: ' + goalError.message,
      payload: { goal: Number(goal) },
    };
  }

  // Create the goal for today
  const { error: todaysGoalError } = await supabase.from('daily_goals').upsert({
    protein_goal_grams: goal,
    user_id: user.id,
    date: date,
  });

  if (todaysGoalError) {
    return {
      error: "Today's Goal Error: " + todaysGoalError.message,
      payload: { goal: Number(goal) },
    };
  }

  revalidatePath('/');
  redirect('/');
};

export type UpdatePreferencesActionState = {
  error?: string;
  data?: {
    goalData: Tables<'daily_goals'>;
    preferenceData: Tables<'user_preferences'>;
  };
  payload: { goal?: number };
};

export const updatePreferences = async (
  _actionState: UpdatePreferencesActionState,
  formData: FormData
): Promise<UpdatePreferencesActionState> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: 'User not found',
      payload: { goal: Number(formData.get('goal')) },
    };
  }

  const { goal, date } = createUpdatePreferencesFormSchema.parse(formData);

  // console.log({ goal, date });

  // Update the user's goal
  const { data: goalPreferenceData, error: goalError } = await supabase
    .from('user_preferences')
    .update({
      preference_value: goal,
      updated_at: `${Temporal.Now.plainDateTimeISO()}`,
    })
    .eq('user_id', user?.id)
    .eq('preference_key', 'goal')
    .select()
    .single();

  if (goalError) {
    return {
      error: 'Goal Error: ' + goalError.message,
      payload: { goal: Number(goal) },
    };
  }

  // Update the goal for today
  const { error: todaysGoalError, data: dayGoalData } = await supabase
    .from('daily_goals')
    .update({
      protein_goal_grams: goal,
    })
    .eq('user_id', user.id)
    .gte('date', date)
    .select();

  if (todaysGoalError) {
    return {
      error: "Today's Goal Error: " + todaysGoalError.message,
      payload: { goal: Number(goal) },
    };
  }

  return {
    data: {
      goalData: dayGoalData.filter(d => d.date === date)[0],
      preferenceData: goalPreferenceData,
    },
    payload: {
      goal: Number(goalPreferenceData.preference_value),
    },
  };
};
