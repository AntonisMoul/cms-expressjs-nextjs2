'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WidgetType, Sidebar, WidgetConfig } from '../../models/types';

export default function CreateWidget() {
  const [sidebars, setSidebars] = useState<Sidebar[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    widget_type: WidgetType.TEXT,
    sidebar_id: '',
    status: 'active'
  });
  const [config, setConfig] = useState<WidgetConfig>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSidebars();
  }, []);

  useEffect(() => {
    // Reset config when widget type changes
    setConfig(getDefaultConfig(formData.widget_type));
  }, [formData.widget_type]);

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
    }
  };

  const getDefaultConfig = (type: WidgetType): WidgetConfig => {
    switch (type) {
      case WidgetType.TEXT:
        return { content: '', title: '', show_title: true };
      case WidgetType.MENU:
        return { menu_id: 0, title: '', show_title: true };
      case WidgetType.RECENT_POSTS:
        return {
          limit: 5,
          show_excerpt: true,
          show_date: true,
          show_author: false,
          title: 'Recent Posts',
          show_title: true
        };
      case WidgetType.CATEGORIES:
        return { show_post_count: true, hierarchical: true, title: 'Categories', show_title: true };
      case WidgetType.TAGS:
        return { limit: 10, show_post_count: true, title: 'Tags', show_title: true };
      case WidgetType.CUSTOM_HTML:
        return { html: '', title: '', show_title: true };
      case WidgetType.IMAGE:
        return { image_url: '', alt_text: '', title: '', show_title: true };
      case WidgetType.VIDEO:
        return { video_url: '', autoplay: false, controls: true, title: '', show_title: true };
      case WidgetType.SEARCH:
        return { placeholder: 'Search...', title: 'Search', show_title: true };
      default:
        return {};
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

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const numValue = type === 'number' ? parseInt(value) : value;

    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? numValue : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const widgetData = {
        ...formData,
        sidebar_id: formData.sidebar_id ? parseInt(formData.sidebar_id) : undefined,
        config
      };

      const response = await fetch('/api/widgets/widgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(widgetData),
      });

      if (!response.ok) {
        throw new Error('Failed to create widget');
      }

      router.push('/admin/widgets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderConfigFields = () => {
    switch (formData.widget_type) {
      case WidgetType.TEXT:
        return (
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content *
            </label>
            <textarea
              name="content"
              id="content"
              required
              rows={4}
              value={(config as any).content || ''}
              onChange={handleConfigChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your text content here..."
            />
          </div>
        );

      case WidgetType.MENU:
        return (
          <div>
            <label htmlFor="menu_id" className="block text-sm font-medium text-gray-700">
              Menu *
            </label>
            <select
              name="menu_id"
              id="menu_id"
              value={(config as any).menu_id || ''}
              onChange={handleConfigChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a menu...</option>
              {/* This would be populated with actual menus from the menu plugin */}
              <option value="1">Main Navigation</option>
              <option value="2">Footer Menu</option>
            </select>
          </div>
        );

      case WidgetType.RECENT_POSTS:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
                Number of Posts
              </label>
              <input
                type="number"
                name="limit"
                id="limit"
                min="1"
                max="20"
                value={(config as any).limit || 5}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="show_excerpt"
                  id="show_excerpt"
                  checked={(config as any).show_excerpt || false}
                  onChange={handleConfigChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="show_excerpt" className="ml-2 block text-sm text-gray-900">
                  Show excerpt
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="show_date"
                  id="show_date"
                  checked={(config as any).show_date || false}
                  onChange={handleConfigChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="show_date" className="ml-2 block text-sm text-gray-900">
                  Show date
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="show_author"
                  id="show_author"
                  checked={(config as any).show_author || false}
                  onChange={handleConfigChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="show_author" className="ml-2 block text-sm text-gray-900">
                  Show author
                </label>
              </div>
            </div>
          </div>
        );

      case WidgetType.CUSTOM_HTML:
        return (
          <div>
            <label htmlFor="html" className="block text-sm font-medium text-gray-700">
              HTML Content *
            </label>
            <textarea
              name="html"
              id="html"
              required
              rows={6}
              value={(config as any).html || ''}
              onChange={handleConfigChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder="<div>Your HTML here...</div>"
            />
          </div>
        );

      case WidgetType.IMAGE:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                Image URL *
              </label>
              <input
                type="url"
                name="image_url"
                id="image_url"
                required
                value={(config as any).image_url || ''}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label htmlFor="alt_text" className="block text-sm font-medium text-gray-700">
                Alt Text
              </label>
              <input
                type="text"
                name="alt_text"
                id="alt_text"
                value={(config as any).alt_text || ''}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="link_url" className="block text-sm font-medium text-gray-700">
                Link URL (optional)
              </label>
              <input
                type="url"
                name="link_url"
                id="link_url"
                value={(config as any).link_url || ''}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Create Widget</h3>
            <p className="mt-1 text-sm text-gray-600">
              Create a new widget for your website.
            </p>
          </div>
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Widget Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="My Widget"
                  />
                </div>

                <div>
                  <label htmlFor="widget_type" className="block text-sm font-medium text-gray-700">
                    Widget Type *
                  </label>
                  <select
                    name="widget_type"
                    id="widget_type"
                    value={formData.widget_type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value={WidgetType.TEXT}>Text</option>
                    <option value={WidgetType.MENU}>Menu</option>
                    <option value={WidgetType.RECENT_POSTS}>Recent Posts</option>
                    <option value={WidgetType.CATEGORIES}>Categories</option>
                    <option value={WidgetType.TAGS}>Tags</option>
                    <option value={WidgetType.CUSTOM_HTML}>Custom HTML</option>
                    <option value={WidgetType.IMAGE}>Image</option>
                    <option value={WidgetType.VIDEO}>Video</option>
                    <option value={WidgetType.SOCIAL_LINKS}>Social Links</option>
                    <option value={WidgetType.SEARCH}>Search</option>
                    <option value={WidgetType.NEWSLETTER}>Newsletter</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sidebar_id" className="block text-sm font-medium text-gray-700">
                    Sidebar
                  </label>
                  <select
                    name="sidebar_id"
                    id="sidebar_id"
                    value={formData.sidebar_id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Unassigned</option>
                    {sidebars.map((sidebar) => (
                      <option key={sidebar.id} value={sidebar.id}>
                        {sidebar.name} ({sidebar.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Common config fields */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={(config as any).title || ''}
                      onChange={handleConfigChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="show_title"
                      id="show_title"
                      checked={(config as any).show_title !== false}
                      onChange={handleConfigChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="show_title" className="ml-2 block text-sm text-gray-900">
                      Show title
                    </label>
                  </div>

                  <div>
                    <label htmlFor="css_class" className="block text-sm font-medium text-gray-700">
                      CSS Class
                    </label>
                    <input
                      type="text"
                      name="css_class"
                      id="css_class"
                      value={(config as any).css_class || ''}
                      onChange={handleConfigChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="custom-widget-class"
                    />
                  </div>
                </div>

                {/* Widget-specific config fields */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Widget Configuration</h4>
                  {renderConfigFields()}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Widget'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
