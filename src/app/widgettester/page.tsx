import DayNav from '@/components/dayNav';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { AppHeader } from '@/components/appHeader';
import { Metadata } from 'next';
import Widgets from './widgets';
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
  // const data = useLoaderData<typeof loader>();
  // const navigation = useNavigation();
  const date = (await params).date || today();

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
      <WeeksNav currentDate={date} />
      {/* <Widgets /> */}
    </>
  );
}
