import DayNav from '@/components/dayNav';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { AppHeader } from '@/components/appHeader';

export default async function Page({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
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

  return (
    <>
      <AppHeader />
      <DayNav currentDate={date} />
    </>
  );
}
