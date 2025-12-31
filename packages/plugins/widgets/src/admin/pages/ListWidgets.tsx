'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Widget, Sidebar } from '../../models/types';

export default function ListWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [sidebars, setSidebars] = useState<Sidebar[]>([]);
  const [selectedSidebar, setSelectedSidebar] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSidebars();
    fetchWidgets();
  }, []);

  useEffect(() => {
    fetchWidgets();
  }, [selectedSidebar]);

  const fetchWidgets = async () => {
    try {
      const url = selectedSidebar
        ? `/api/widgets/widgets?sidebar_id=${selectedSidebar}`
        : '/api/widgets/widgets';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch widgets');
      }
      const data = await response.json();
      setWidgets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchSidebars = async () => {
    try {
      const response = await fetch('/api/widgets/sidebars');
      if (!response.ok) {
        throw new Error('Failed to fetch sidebars');
      }
      const data = await response.json();
      setSidebars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sidebars');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this widget?')) {
      return;
    }

    try {
      const response = await fetch(`/api/widgets/widgets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete widget');
      }

      setWidgets(widgets.filter(widget => widget.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete widget');
    }
  };

  const getSidebarName = (sidebarId: number | null) => {
    if (!sidebarId) return 'Unassigned';
    const sidebar = sidebars.find(s => s.id === sidebarId);
    return sidebar ? sidebar.name : 'Unknown';
  };

  const getWidgetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      text: 'Text',
      menu: 'Menu',
      recent_posts: 'Recent Posts',
      categories: 'Categories',
      tags: 'Tags',
      custom_html: 'Custom HTML',
      image: 'Image',
      video: 'Video',
      social_links: 'Social Links',
      search: 'Search',
      newsletter: 'Newsletter'
    };
    return labels[type] || type;
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
          <h1 className="text-2xl font-semibold text-gray-900">Widgets</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage widgets and their placements in sidebars.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/widgets/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Widget
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Sidebar Filter */}
      <div className="mt-6">
        <label htmlFor="sidebar-filter" className="block text-sm font-medium text-gray-700">
          Filter by Sidebar
        </label>
        <select
          id="sidebar-filter"
          value={selectedSidebar || ''}
          onChange={(e) => setSelectedSidebar(e.target.value ? parseInt(e.target.value) : null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Widgets</option>
          {sidebars.map((sidebar) => (
            <option key={sidebar.id} value={sidebar.id}>
              {sidebar.name} ({sidebar.location})
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Sidebar
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Position
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
                  {widgets.map((widget) => (
                    <tr key={widget.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {widget.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getWidgetTypeLabel(widget.widget_type)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getSidebarName(widget.sidebar_id)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {widget.position}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          widget.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {widget.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/admin/widgets/${widget.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(widget.id)}
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

      {widgets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {selectedSidebar ? 'No widgets found in this sidebar.' : 'No widgets found.'}
          </p>
          <Link
            href="/admin/widgets/create"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create your first widget
          </Link>
        </div>
      )}
    </div>
  );
}
