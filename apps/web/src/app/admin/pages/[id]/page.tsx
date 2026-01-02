'use client';

import { use } from 'react';
import PageForm from '@/components/pages/PageForm';

export default function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const pageId = parseInt(resolvedParams.id);

  return (
    <div className="edit-page">
      <h1>Edit Page</h1>
      <PageForm pageId={pageId} />
    </div>
  );
}

