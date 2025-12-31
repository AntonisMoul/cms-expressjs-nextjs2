import { EditPage } from '@cms/plugins-pages/admin';

interface EditPagesPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPagesPage({ params }: EditPagesPageProps) {
  const { id } = await params;
  return <EditPage id={id} />;
}
