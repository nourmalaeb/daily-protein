'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/utils/supabase/server';
import dayjs from 'dayjs';
import { zfd } from 'zod-form-data';
import { z } from 'zod';

const createLoginFormSchema = zfd.formData({
  email: zfd.text(z.string().trim().email()),
  password: zfd.text(z.string().trim()),
});

export async function login(
  _prevState: { error: string; data: { email: string; password: string } },
  formData: FormData
) {
  const supabase = await createClient();

  const data = createLoginFormSchema.parse(formData);

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message, data };
  }

  revalidatePath('/on/' + dayjs().format('YYYY-MM-DD'), 'layout');
  redirect('/on/' + dayjs().format('YYYY-MM-DD'));
}

const createSignupFormSchema = zfd.formData({
  email: zfd.text(z.string().trim().email()),
  password: zfd.text(z.string().trim()),
});

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = createSignupFormSchema.parse(formData);

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/');
  redirect('/');
}
