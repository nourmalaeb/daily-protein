'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { MealType } from '@/lib/types';
import { Tables } from '../../../../database.types';

export type CreateEntriesActionState = {
  errors?: string;
  success: boolean;
  data?: Tables<'protein_entries'>[];
};

export async function createEntries(
  date: string,
  _prevState: CreateEntriesActionState,
  formData: FormData
): Promise<CreateEntriesActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, errors: 'No user' };
  }

  const rawItems = formData.getAll('item') as string[];
  const rawAmounts = formData.getAll('amount') as string[];
  const meal = formData.get('meal') as MealType;

  const itemsToSave = (rawItems: string[]) =>
    rawItems.map((itemName, idx) => ({
      meal: meal,
      food_name: itemName,
      protein_grams: Number(rawAmounts[idx]),
      date,
      user_id: user.id,
    }));

  const { data, error } = await supabase
    .from('protein_entries')
    .insert(itemsToSave(rawItems))
    .select();

  if (error) {
    return { success: false, errors: error.message };
  }

  // revalidatePath(`/on/${date}`);
  return { success: true, data };
  // redirect(`/on/${date}`);
}

export async function editEntryById(
  date: string,
  _prevState: { errors?: string; success: boolean },
  formData: FormData
) {
  const supabase = await createClient();

  const food_name = formData.get('item') as string;
  const protein_grams = Number(formData.get('amount') as string);
  const meal = formData.get('meal') as MealType;
  const entry_id = Number(formData.get('id') as string);

  const { error } = await supabase
    .from('protein_entries')
    .update({
      food_name,
      protein_grams,
      meal,
    })
    .eq('entry_id', entry_id);

  if (error) {
    return { success: false, errors: error.message };
  }

  // revalidatePath(`/on/${date}`);
  return { success: true };
}

export async function deleteEntryById(date: string, formData: FormData) {
  const supabase = await createClient();

  const entry_id = Number(formData.get('id') as string);

  const { error } = await supabase
    .from('protein_entries')
    .delete()
    .eq('entry_id', entry_id);

  if (error) {
    redirect('/error');
  }

  // revalidatePath(`/on/${date}`);
  return;
}
