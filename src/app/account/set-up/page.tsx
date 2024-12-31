import { MainWrapper } from '@/components/mainWrapper';
import { createClient } from '@/lib/utils/supabase/server';
import { AppHeader } from '@/components/appHeader';
import GoalSetupForm from './goalSetUpForm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <MainWrapper>
      <AppHeader />
      <div className="p-4 flex flex-col gap-4">
        <h1 className="font-bold text-2xl tracking-tight">
          Set your protein goal
        </h1>
        <p>
          How of grams of protein you are trying to eat each day? You can adjust
          this number at any time, so don’t overthink it right now.
        </p>
        <p>
          <strong>What should my goal be?</strong>
        </p>
        <p>
          Your daily protein goal should somewhere in the range of 0.5–1 grams
          of protein per lb of body weight. The more active you are, the more
          protein you need. You also need to take into consideration your goals
          and your current body composition.
        </p>
        <ProteinVisualization />
        <p>
          <Link
            href="https://www.shesabeast.co/how-much-protein-do-i-need-easy-mode/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-orange-600 dark:text-orange-300"
          >
            Learn more here. <ExternalLink size={16} />
          </Link>
        </p>
        <GoalSetupForm />
      </div>
    </MainWrapper>
  );
}

const ProteinVisualization = () => {
  return (
    <div className="relative w-full">
      <h2 className="font-bold mb-2">
        Optimal protein intake for adults, g/lb
      </h2>
      <div className="flex w-full gap-2 items-center justify-stretch text-xs font-semibold uppercase tracking-wider">
        <p className="w-full font-mono">Sedentary</p>
        <p className="w-full font-mono text-center">Active</p>
        <p className="w-full font-mono text-right">Body recomp</p>
      </div>
      <div className="w-full h-2 my-1 rounded-full bg-gradient-to-r from-lunch dark:from-lunch-dark to-breakfast dark:to-breakfast-dark" />
      <div className="flex w-full gap-2 items-center justify-stretch text-xs font-semibold">
        <p className="w-full font-mono">0.5g</p>
        <p className="w-full font-mono text-center">0.75g</p>
        <p className="w-full font-mono text-right">1g</p>
      </div>
    </div>
  );
};
