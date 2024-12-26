import { Modal } from '@/components/modal';
import EditEntryForm from '@/components/editEntryForm';
import { createClient } from '@/lib/utils/supabase/server';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ date: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const supabase = await createClient();
  const data = await supabase
    .from('protein_entries')
    .select('*')
    .eq('entry_id', (await params).id);

  if (!data.data) {
    return null;
  }

  return (
    <Modal>
      <EditEntryForm
        meal={(await searchParams).meal}
        date={(await params).date}
        item={data.data[0]}
      />
    </Modal>
  );
}
