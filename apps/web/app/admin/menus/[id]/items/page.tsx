'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MenuItem, HierarchicalMenuItem } from '@cms/shared';

interface MenuItemFormData {
  title: string;
  url: string;
  target: string;
  icon_class: string;
  css_class: string;
}

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [hierarchicalItems, setHierarchicalItems] = useState<HierarchicalMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItemFormData>({
    title: '',
    url: '',
    target: '_self',
    icon_class: '',
    css_class: ''
  });
  const router = useRouter();
  const params = useParams();
  const menuId = parseInt(params.id as string);

  useEffect(() => {
    fetchMenuItems();
  }, [menuId]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`/api/menu/menus/${menuId}/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const items: MenuItem[] = await response.json();
      setMenuItems(items);
      setHierarchicalItems(buildHierarchy(items));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const buildHierarchy = (items: MenuItem[]): HierarchicalMenuItem[] => {
    const itemMap = new Map<number, HierarchicalMenuItem>();
    const roots: HierarchicalMenuItem[] = [];

    // Convert items to hierarchical format
    items.forEach(item => {
      const hierarchicalItem: HierarchicalMenuItem = {
        ...item,
        children: [],
        depth: 0
      };
      itemMap.set(item.id, hierarchicalItem);
    });

    // Build hierarchy
    items.forEach(item => {
      const hierarchicalItem = itemMap.get(item.id)!;

      if (item.parent_id && item.parent_id !== 0) {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children.push(hierarchicalItem);
          hierarchicalItem.depth = parent.depth + 1;
        } else {
          roots.push(hierarchicalItem);
        }
      } else {
        roots.push(hierarchicalItem);
      }
    });

    // Sort by position
    const sortByPosition = (a: HierarchicalMenuItem, b: HierarchicalMenuItem) => a.position - b.position;
    roots.sort(sortByPosition);
    roots.forEach(root => sortChildrenRecursive(root, sortByPosition));

    return roots;
  };

  const sortChildrenRecursive = (item: HierarchicalMenuItem, sortFn: (a: HierarchicalMenuItem, b: HierarchicalMenuItem) => number) => {
    item.children.sort(sortFn);
    item.children.forEach(child => sortChildrenRecursive(child, sortFn));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingItem
        ? `/api/menu/menu-items/${editingItem.id}`
        : `/api/menu/menus/${menuId}/items`;

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingItem ? 'update' : 'create'} menu item`);
      }

      setShowForm(false);
      setEditingItem(null);
      setFormData({
        title: '',
        url: '',
        target: '_self',
        icon_class: '',
        css_class: ''
      });
      fetchMenuItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      url: item.url,
      target: item.target || '_self',
      icon_class: item.icon_class || '',
      css_class: item.css_class || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/menu/menu-items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      fetchMenuItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu item');
    }
  };

  const renderMenuItem = (item: HierarchicalMenuItem) => (
    <div key={item.id} className="flex items-center py-2">
      <div className="flex-1" style={{ paddingLeft: `${item.depth * 20}px` }}>
        <div className="flex items-center">
          {item.depth > 0 && <span className="text-gray-400 mr-2">└─</span>}
          <span className="font-medium">{item.title}</span>
          <span className="text-gray-500 text-sm ml-2">({item.url})</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(item)}
          className="text-indigo-600 hover:text-indigo-900 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(item.id)}
          className="text-red-600 hover:text-red-900 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-semibold text-gray-900">Menu Items</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage items for this menu.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {showForm ? 'Cancel' : 'Add Item'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  URL *
                </label>
                <input
                  type="text"
                  name="url"
                  id="url"
                  required
                  value={formData.url}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="/page-url or https://external-link.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-gray-700">
                    Target
                  </label>
                  <select
                    name="target"
                    id="target"
                    value={formData.target}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="_self">Same Window</option>
                    <option value="_blank">New Window</option>
                    <option value="_parent">Parent Frame</option>
                    <option value="_top">Top Frame</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="icon_class" className="block text-sm font-medium text-gray-700">
                    Icon Class
                  </label>
                  <input
                    type="text"
                    name="icon_class"
                    id="icon_class"
                    value={formData.icon_class}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="fas fa-home"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="css_class" className="block text-sm font-medium text-gray-700">
                  CSS Class
                </label>
                <input
                  type="text"
                  name="css_class"
                  id="css_class"
                  value={formData.css_class}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="menu-item-custom"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    setFormData({
                      title: '',
                      url: '',
                      target: '_self',
                      icon_class: '',
                      css_class: ''
                    });
                  }}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Menu Structure</h3>
          <p className="mt-1 text-sm text-gray-500">
            Current menu items in hierarchical order.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            {hierarchicalItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No menu items found. Add your first item above.
              </p>
            ) : (
              <div className="space-y-1">
                {hierarchicalItems.map(item => renderMenuItem(item))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => router.push('/admin/menus')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          ← Back to Menus
        </button>
      </div>
    </div>
  );
}