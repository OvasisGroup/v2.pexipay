import SuperMerchantMerchantEdit from './SuperMerchantMerchantEdit';

export default async function SuperMerchantMerchantEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SuperMerchantMerchantEdit merchantId={id} />;
}
