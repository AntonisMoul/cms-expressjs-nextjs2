'use client';

import { useEffect, useState } from 'react';
import { pagesApi, Page } from '@/lib/api/pages';
import Link from 'next/link';

export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    currentPage: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await pagesApi.list({
        page: meta.currentPage,
        perPage: meta.perPage,
      });
      setPages(response.data.pages);
      setMeta(response.data.meta);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      await pagesApi.delete(id);
      loadPages();
    } catch (err: any) {
      alert(err.message || 'Failed to delete page');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="pages-list">
      <div className="pages-header">
        <h1>Pages</h1>
        <Link href="/admin/pages/create" className="btn btn-primary">
          Create Page
        </Link>
      </div>

      <table className="pages-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Slug</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id}>
              <td>{page.name}</td>
              <td>
                <span className={`status status-${page.status}`}>
                  {page.status}
                </span>
              </td>
              <td>{page.slug?.key || '-'}</td>
              <td>{new Date(page.createdAt).toLocaleDateString()}</td>
              <td>
                <Link href={`/admin/pages/${page.id}`} className="btn btn-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {meta.total > 0 && (
        <div className="pagination">
          <p>
            Showing {meta.currentPage} of {meta.lastPage} pages ({meta.total} total)
          </p>
        </div>
      )}
    </div>
  );
}

