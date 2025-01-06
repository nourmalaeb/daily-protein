import type { Metadata } from 'next';
import { MainWrapper } from '@/components/mainWrapper';

export const metadata: Metadata = {
  title: 'daily proteins',
  description: 'eat your gains',
};

export default function RootLayout({
  children,
  entries,
}: {
  children: React.ReactNode;
  entries: React.ReactNode;
}) {
  return (
    <>
      <MainWrapper>
        {children}
        <div className="relative">{entries}</div>
      </MainWrapper>
    </>
  );
}
