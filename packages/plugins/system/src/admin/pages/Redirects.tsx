'use client';

import { useState, useEffect } from 'react';
import { Redirect, RedirectStatusCode } from '../../models/types';

interface RedirectFormData {
  from_url: string;
  to_url: string;
  status_code: RedirectStatusCode;
  is_active: boolean;
}

export default function Redirects() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalHits: 0,
    topRedirects: []
  });
  const [showForm, setShowForm] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);
  const [formData, setFormData] = useState<RedirectFormData>({
    from_url: '',
    to_url: '',
    status_code: RedirectStatusCode.MOVED_PERMANENTLY,
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRedirects();
    fetchStats();
  }, []);

  const fetchRedirects = async () => {
    try {
      const response = await fetch('/api/system/redirects');
      if (!response.ok) {
        throw new Error('Failed to fetch redirects');
      }
      const data = await response.json();
      setRedirects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/system/redirects/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch redirect stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch redirect stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const url = editingRedirect
        ? `/api/system/redirects/${editingRedirect.id}`
        : '/api/system/redirects';

      const method = editingRedirect ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save redirect');
      }

      setShowForm(false);
      setEditingRedirect(null);
      setFormData({
        from_url: '',
        to_url: '',
        status_code: RedirectStatusCode.MOVED_PERMANENTLY,
        is_active: true
      });

      fetchRedirects();
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save redirect');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (redirect: Redirect) => {
    setEditingRedirect(redirect);
    setFormData({
      from_url: redirect.from_url,
      to_url: redirect.to_url,
      status_code: redirect.status_code,
      is_active: redirect.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this redirect?')) {
      return;
    }

    try {
      const response = await fetch(`/api/system/redirects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete redirect');
      }

      setRedirects(redirects.filter(r => r.id !== id));
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete redirect');
    }
  };

  const getStatusCodeLabel = (code: number) => {
    switch (code) {
      case 301: return '301 Moved Permanently';
      case 302: return '302 Found';
      case 307: return '307 Temporary Redirect';
      case 308: return '308 Permanent Redirect';
      default: return code.toString();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">URL Redirects</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage URL redirects for SEO and user experience.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Redirect
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">T</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Redirects</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Redirects</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">H</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Hits</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalHits.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingRedirect ? 'Edit Redirect' : 'Add Redirect'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="from_url" className="block text-sm font-medium text-gray-700">
                    From URL *
                  </label>
                  <input
                    type="text"
                    name="from_url"
                    id="from_url"
                    required
                    value={formData.from_url}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="/old-url"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    The URL to redirect from (must start with /)
                  </p>
                </div>

                <div>
                  <label htmlFor="to_url" className="block text-sm font-medium text-gray-700">
                    To URL *
                  </label>
                  <input
                    type="text"
                    name="to_url"
                    id="to_url"
                    required
                    value={formData.to_url}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="/new-url or https://external-site.com"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    The URL to redirect to
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="status_code" className="block text-sm font-medium text-gray-700">
                    Status Code
                  </label>
                  <select
                    name="status_code"
                    id="status_code"
                    value={formData.status_code}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value={RedirectStatusCode.MOVED_PERMANENTLY}>301 - Moved Permanently</option>
                    <option value={RedirectStatusCode.FOUND}>302 - Found</option>
                    <option value={RedirectStatusCode.TEMPORARY_REDIRECT}>307 - Temporary Redirect</option>
                    <option value={RedirectStatusCode.PERMANENT_REDIRECT}>308 - Permanent Redirect</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRedirect(null);
                    setFormData({
                      from_url: '',
                      to_url: '',
                      status_code: RedirectStatusCode.MOVED_PERMANENTLY,
                      is_active: true
                    });
                  }}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingRedirect ? 'Update Redirect' : 'Create Redirect')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Redirects List */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      From URL
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      To URL
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status Code
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Hits
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {redirects.map((redirect) => (
                    <tr key={redirect.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {redirect.from_url}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {redirect.to_url}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getStatusCodeLabel(redirect.status_code)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {redirect.hits.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          redirect.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {redirect.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(redirect)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(redirect.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {redirects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No redirects found.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create your first redirect
          </button>
        </div>
      )}
    </div>
  );
}
