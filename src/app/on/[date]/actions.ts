'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createEntries(
  date: string,
  _prevSTate: { errors?: string; success: boolean },
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rawItems = formData.getAll('item') as string[];
  const rawAmounts = formData.getAll('amount') as string[];
  const meal = formData.get('meal') as string;

  const itemsToSave = rawItems.map((itemName, idx) => ({
    meal: meal,
    food_name: itemName,
    protein_grams: Number(rawAmounts[idx]),
    date,
    user_id: user?.id,
  }));

  const { error } = await supabase.from('protein_entries').insert(itemsToSave);

  if (error) {
    return { success: false, errors: error.message };
  }

  revalidatePath(`/on/${date}`);
  return { success: true };
  // redirect(`/on/${date}`);
}

export async function editEntryById(
  date: string,
  _prevSTate: { errors?: string; success: boolean },
  formData: FormData
) {
  const supabase = await createClient();

  const food_name = formData.get('item') as string;
  const protein_grams = Number(formData.get('amount') as string);
  const meal = formData.get('meal') as string;
  const entry_id = formData.get('id') as string;

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

  revalidatePath(`/on/${date}`);
  return { success: true };
}

export async function deleteEntryById(date: string, formData: FormData) {
  const supabase = await createClient();

  const entry_id = formData.get('id') as string;

  const { error } = await supabase
    .from('protein_entries')
    .delete()
    .eq('entry_id', entry_id);

  if (error) {
    redirect('/error');
  }

  revalidatePath(`/on/${date}`);
  redirect(`/on/${date}`);
}
