import { Metadata } from 'next';
import AuthenticatedPageWrapper from './pageWrapper';

type Params = {
  params: Promise<{ date: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  // read route params
  const date = (await params).date;
  return {
    title: `proteins on ${date}`,
  };
}

export default async function Page({ params }: Params) {
  // const data = useLoaderData<typeof loader>();
  // const navigation = useNavigation();
  const date = (await params).date;

  return <AuthenticatedPageWrapper date={date} />;
}
