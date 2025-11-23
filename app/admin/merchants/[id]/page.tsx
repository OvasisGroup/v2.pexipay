import MerchantDetailContent from './MerchantDetailContent';

export default async function MerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <MerchantDetailContent merchantId={id} />;
}
