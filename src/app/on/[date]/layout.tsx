import { MainWrapper } from '@/components/mainWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainWrapper>{children}</MainWrapper>
    </>
  );
}
