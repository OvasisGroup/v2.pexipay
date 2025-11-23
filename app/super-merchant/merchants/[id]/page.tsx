import SuperMerchantMerchantDetail from './SuperMerchantMerchantDetail';

export default async function SuperMerchantMerchantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SuperMerchantMerchantDetail merchantId={id} />;
}
