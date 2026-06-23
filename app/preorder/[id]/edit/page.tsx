import PreorderForm from '@/components/PreorderForm';

interface EditPreorderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPreorderPage({ params }: EditPreorderPageProps) {
  const { id } = await params;
  return <PreorderForm preorderId={id} />;
}
