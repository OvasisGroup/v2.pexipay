import EditMerchantContent from './EditMerchantContent';

export default async function EditMerchantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditMerchantContent merchantId={id} />;
}
