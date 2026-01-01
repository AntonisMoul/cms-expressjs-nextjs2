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

export default function MenusPage() {
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
        fetchMenus(); // Refresh the list
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
      pending: 'bg-blue-100 text-blue-800',
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
          <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
          <p className="text-gray-600 mt-1">Create and manage navigation menus for your site</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {showCreateForm ? 'Cancel' : 'Create Menu'}
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
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Create Menu
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menus List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Your Menus</h2>
        </div>

        {menus.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">🍽️</div>
            <p className="text-lg mb-2">No menus created yet</p>
            <p className="text-sm">Create your first menu to get started with navigation</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {menus.map((menu) => (
              <div key={menu.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-medium text-gray-900">{menu.name}</h3>
                      {getStatusBadge(menu.status)}
                    </div>
                    {menu.slug && (
                      <p className="text-sm text-gray-500 mt-1">Slug: {menu.slug}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Created {new Date(menu.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/appearance/menus/${menu.id}/edit`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit Menu
                    </Link>
                    <button
                      onClick={() => handleDeleteMenu(menu.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Locations Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Menu Locations</h3>
        <p className="text-sm text-blue-700">
          After creating menus, you can assign them to specific locations on your site such as header navigation, footer menus, etc.
          Edit individual menus to add menu items and customize their structure.
        </p>
      </div>
    </div>
  );
}

