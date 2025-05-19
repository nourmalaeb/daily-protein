import { MainWrapper } from '@/components/mainWrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainWrapper className="overflow-auto">{children}</MainWrapper>
    </>
  );
}
