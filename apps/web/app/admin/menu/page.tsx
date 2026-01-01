'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Menu {
  id: string;
  name: string;
  slug?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menu/menus');
      const result = await response.json();

      if (result.success) {
        setMenus(result.data.menus);
      }
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMenuName.trim()) return;

    try {
      const response = await fetch('/api/menu/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newMenuName.trim(),
        }),
      });

      if (response.ok) {
        setNewMenuName('');
        setShowCreateForm(false);
        fetchMenus(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to create menu:', error);
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm('Are you sure you want to delete this menu? This will also delete all menu items.')) {
      return;
    }

    try {
      const response = await fetch(`/api/menu/menus/${menuId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenus(menus.filter(menu => menu.id !== menuId));
      }
    } catch (error) {
      console.error('Failed to delete menu:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">Create and manage navigation menus</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create Menu
        </button>
      </div>

      {/* Create Menu Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-medium mb-4">Create New Menu</h2>
          <form onSubmit={handleCreateMenu}>
            <div className="mb-4">
              <label htmlFor="menuName" className="block text-sm font-medium text-gray-700 mb-2">
                Menu Name
              </label>
              <input
                type="text"
                id="menuName"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter menu name"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Create Menu
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewMenuName('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Locations Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Menu Locations</h3>
        <p className="text-sm text-blue-700">
          Menus can be assigned to different locations on your site. Currently available locations:
          <strong> main-menu</strong> (header navigation).
          You can configure additional locations in your theme.
        </p>
      </div>

      {/* Menus Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menus.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="text-4xl mb-4">🍽️</div>
                  <p>No menus found</p>
                  <p className="text-sm">Create your first menu to get started</p>
                </td>
              </tr>
            ) : (
              menus.map((menu) => (
                <tr key={menu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {menu.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(menu.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* We'll implement item count later */}
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(menu.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/menu/${menu.id}/builder`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit Structure
                    </Link>
                    <Link
                      href={`/admin/menu/${menu.id}/settings`}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => handleDeleteMenu(menu.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-2">How to use menus</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click "Edit Structure" to add, reorder, and configure menu items</li>
          <li>• Use "Settings" to configure menu properties and assign to locations</li>
          <li>• Menu items can link to pages, posts, categories, or custom URLs</li>
          <li>• Drag and drop items to reorder them in the menu builder</li>
        </ul>
      </div>
    </div>
  );
}
