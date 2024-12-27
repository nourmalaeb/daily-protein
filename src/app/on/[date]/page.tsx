import dayjs from 'dayjs';
import DayNav from '@/components/dayNav';
import MealItems from '@/components/mealItems';
import { Meter } from '@/components/meter';
import { itemsParser } from '@/lib/utils';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { AppHeader } from '@/components/appHeader';
dayjs.extend(customParseFormat);
dayjs.extend(LocalizedFormat);

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

  if (!date || !dayjs(date, 'YYYY-MM-DD', true).isValid()) {
    redirect(`/on/${dayjs().format('YYYY-MM-DD')}`);
  }

  const { data } = await supabase
    .from('protein_entries')
    .select()
    .eq('date', date)
    .eq('user_id', user?.id);

  const parsedItems = data ? itemsParser(data) : undefined;

  return (
    <>
      <AppHeader user={user} />
      <DayNav currentDate={date} />
      <div>
        <Meter goal={200} stats={parsedItems?.stats} />
        <MealItems
          items={parsedItems?.breakfastItems}
          category={'breakfast'}
          date={date}
        />
        <MealItems
          items={parsedItems?.lunchItems}
          category={'lunch'}
          date={date}
        />
        <MealItems
          items={parsedItems?.dinnerItems}
          category={'dinner'}
          date={date}
        />
        <MealItems
          items={parsedItems?.snacksItems}
          category={'snacks'}
          date={date}
        />
      </div>
    </>
  );
}
