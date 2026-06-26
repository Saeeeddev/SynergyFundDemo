export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <div className="p-6">
      <h1 className="text-h-title text-text">جزئیات پروژه: {projectId}</h1>
    </div>
  );
}
