import { Modal } from '@/components/modal';
import AddForm from '@/components/addEntryForm';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <Modal>
      <AddForm meal={(await searchParams).meal} date={(await params).date} />
    </Modal>
  );
}
