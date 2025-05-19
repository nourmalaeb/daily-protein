import { MainWrapper } from '@/components/mainWrapper';

export default function Layout({
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
