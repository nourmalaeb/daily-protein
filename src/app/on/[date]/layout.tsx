import type { Metadata } from 'next';
import { MainWrapper } from '@/components/mainWrapper';

export const metadata: Metadata = {
  title: 'daily proteins',
  description: 'eat your gains',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainWrapper>{children}</MainWrapper>
      <div id="modal-root" />
    </>
  );
}
