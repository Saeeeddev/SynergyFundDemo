export default async function SellPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <div className="p-6">
      <h1 className="text-h-title text-text">فروش دارایی: {projectId}</h1>
    </div>
  );
}
