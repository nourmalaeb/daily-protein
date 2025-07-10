import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { AppHeader } from '@/components/appHeader';
import { Metadata } from 'next';
import { today } from '@/lib/utils';
import WeeksNav from './weeksNav';

type Params = {
  params: Promise<{ date: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  // read route params
  const date = (await params).date;
  return {
    title: `proteins on ${date}`,
  };
}

export default async function Page({ params }: Params) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <AppHeader user={user} />
      <WeeksNav />
    </>
  );
}
