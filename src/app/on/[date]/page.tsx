import DayNav from '@/components/dayNav';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { AppHeader } from '@/components/appHeader';
import { Metadata } from 'next';
import { getPreferences } from '@/app/account/actions';

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
  // const data = useLoaderData<typeof loader>();
  // const navigation = useNavigation();
  const date = (await params).date;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: preferences } = await getPreferences(supabase, user);

  return (
    <>
      <AppHeader user={user} preferences={preferences} />
      <DayNav currentDate={date} />
    </>
  );
}
