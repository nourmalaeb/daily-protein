import dayjs from 'dayjs';
import MealItems from '@/components/mealItems';
import { Meter } from '@/components/meter';
import { itemsParser } from '@/lib/utils';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { AnimatedBorderDiv } from '@/components/specialContainers';
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

  const { data: goalData } = await supabase
    .from('daily_goals')
    .select()
    .eq('user_id', user?.id)
    .eq('date', date)
    .single();

  const { data: dayData } = await supabase
    .from('daily_totals')
    .select()
    .eq('user_id', user?.id)
    .eq('date', date)
    .single();

  const parsedItems = data ? itemsParser(data) : undefined;

  return (
    <div>
      <AnimatedBorderDiv
        animate={
          dayData
            ? dayData.total_protein_grams >= goalData.protein_goal_grams
            : false
        }
        borderClasses="border-zinc-500/30 hover:border-zinc-500/80"
        className="rounded-xl border mx-2"
      >
        <Meter
          goal={goalData?.protein_goal_grams}
          stats={parsedItems?.stats}
          date={date}
        />
      </AnimatedBorderDiv>
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
  );
}
