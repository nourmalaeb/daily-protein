'use client';

import { AppHeader } from '@/components/appHeader';
import DayNav from '@/components/dayNav';
import { Authenticated } from 'convex/react';
import DayEntries from './dayEntries';

export default function AuthenticatedPageWrapper({ date }: { date: string }) {
  return (
    <Authenticated>
      <AppHeader />
      <DayNav currentDate={date} />
      <div className="relative">
        <DayEntries />
      </div>
    </Authenticated>
  );
}
