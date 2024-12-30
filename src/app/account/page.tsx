import { MainWrapper } from '@/components/mainWrapper';
import AccountForm from './account-form';
import { createClient } from '@/lib/utils/supabase/server';
import { AppHeader } from '@/components/appHeader';
import { getPreferences } from './actions';
import { redirect } from 'next/navigation';

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await getPreferences(supabase, user);

  if (error || !data) {
    return <div>Error: {error}</div>;
  }

  return (
    <MainWrapper>
      <AppHeader />
      <h1 className="font-bold text-2xl tracking-tight p-4">Preferences</h1>
      <AccountForm data={data} />
    </MainWrapper>
  );
}
