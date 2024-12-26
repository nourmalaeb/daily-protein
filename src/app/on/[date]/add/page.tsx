import AddForm from '@/components/addEntryForm';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <AddForm meal={(await searchParams).meal} date={(await params).date} />
  );
}
