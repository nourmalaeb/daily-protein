import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/utils/supabase/middleware';
import { createClient } from './lib/utils/supabase/server';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/on')) {
    const supabase = await createClient();
    const date = request.nextUrl.pathname.split('/').pop()?.slice(0, 10);

    if (!date) {
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // update the user's daily goal for today
      const { data: goalData } = await supabase
        .from('daily_goals')
        .select()
        .eq('user_id', user?.id)
        .eq('date', date)
        .single();

      if (!goalData) {
        const { data: goalPreference } = await supabase
          .from('user_preferences')
          .select()
          .eq('user_id', user?.id)
          .eq('preference_key', 'goal')
          .single();

        await supabase.from('daily_goals').insert({
          protein_goal_grams: goalPreference.preference_value,
          date: date,
          user_id: user?.id,
        });
      }
    }
  }
  // update user's auth session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
