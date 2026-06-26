export default async function InvestPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <div className="p-6">
      <h1 className="text-h-title text-text">سرمایه‌گذاری در: {projectId}</h1>
    </div>
  );
}
