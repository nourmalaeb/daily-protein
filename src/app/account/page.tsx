import { MainWrapper } from '@/components/mainWrapper';
import AccountForm from './account-form';
import { createClient } from '@/lib/utils/supabase/server';
import { AppHeader } from '@/components/appHeader';

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <MainWrapper>
      <AppHeader />
      <AccountForm user={user} />
    </MainWrapper>
  );
}
