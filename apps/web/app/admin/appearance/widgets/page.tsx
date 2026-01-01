'use client';

import { useState, useEffect } from 'react';

interface Widget {
  id: string;
  widgetId: string;
  sidebarId: string;
  position: number;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

interface WidgetType {
  id: string;
  name: string;
  description?: string;
}

interface Sidebar {
  id: string;
  name: string;
  description?: string;
}

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [widgetTypes, setWidgetTypes] = useState<WidgetType[]>([]);
  const [sidebars, setSidebars] = useState<Sidebar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSidebar, setSelectedSidebar] = useState('primary_sidebar');

  useEffect(() => {
    fetchWidgetData();
  }, []);

  useEffect(() => {
    fetchWidgetsForSidebar();
  }, [selectedSidebar]);

  const fetchWidgetData = async () => {
    try {
      const [typesRes, sidebarsRes] = await Promise.all([
        fetch('/api/widget/types'),
        fetch('/api/widget/sidebars'),
      ]);

      const typesResult = await typesRes.json();
      const sidebarsResult = await sidebarsRes.json();

      if (typesResult.success) {
        setWidgetTypes(typesResult.data.widgetTypes);
      }

      if (sidebarsResult.success) {
        setSidebars(sidebarsResult.data.sidebars);
      }
    } catch (error) {
      console.error('Failed to fetch widget data:', error);
    }
  };

  const fetchWidgetsForSidebar = async () => {
    try {
      const response = await fetch(`/api/widget/sidebars/${selectedSidebar}/widgets`);
      const result = await response.json();

      if (result.success) {
        setWidgets(result.data.widgets);
      }
    } catch (error) {
      console.error('Failed to fetch widgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWidget = async (widgetTypeId: string) => {
    try {
      const response = await fetch('/api/widget/widgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          widgetId: widgetTypeId,
          sidebarId: selectedSidebar,
          data: {},
        }),
      });

      if (response.ok) {
        fetchWidgetsForSidebar();
      }
    } catch (error) {
      console.error('Failed to add widget:', error);
    }
  };

  const handleDeleteWidget = async (widgetId: string) => {
    if (!confirm('Are you sure you want to delete this widget?')) return;

    try {
      const response = await fetch(`/api/widget/widgets/${widgetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWidgets(widgets.filter(w => w.id !== widgetId));
      }
    } catch (error) {
      console.error('Failed to delete widget:', error);
    }
  };

  const handleMoveWidget = async (widgetId: string, direction: 'up' | 'down') => {
    const currentIndex = widgets.findIndex(w => w.id === widgetId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === widgets.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newWidgets = [...widgets];
    [newWidgets[currentIndex], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[currentIndex]];

    // Update positions
    const reorderedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      position: index,
    }));

    try {
      const response = await fetch('/api/widget/widgets/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sidebarId: selectedSidebar,
          widgetIds: reorderedWidgets.map(w => w.id),
        }),
      });

      if (response.ok) {
        setWidgets(reorderedWidgets);
      }
    } catch (error) {
      console.error('Failed to reorder widgets:', error);
    }
  };

  const getWidgetTypeName = (widgetId: string) => {
    const type = widgetTypes.find(t => t.id === widgetId);
    return type ? type.name : widgetId;
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
          <h1 className="text-2xl font-bold text-gray-900">Widgets</h1>
          <p className="text-gray-600 mt-1">Manage widgets in different sidebar areas</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Selection */}
        <div className="col-span-12">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Widget Area
            </label>
            <select
              value={selectedSidebar}
              onChange={(e) => setSelectedSidebar(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sidebars.map(sidebar => (
                <option key={sidebar.id} value={sidebar.id}>
                  {sidebar.name}
                  {sidebar.description && ` - ${sidebar.description}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Available Widgets */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">Available Widgets</h2>
            </div>
            <div className="p-4 space-y-3">
              {widgetTypes.map(widgetType => (
                <div
                  key={widgetType.id}
                  className="border rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{widgetType.name}</h3>
                      {widgetType.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {widgetType.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddWidget(widgetType.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Widgets */}
        <div className="col-span-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">
                Widgets in {sidebars.find(s => s.id === selectedSidebar)?.name || selectedSidebar}
                {widgets.length > 0 && ` (${widgets.length})`}
              </h2>
            </div>

            {widgets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-4">📦</div>
                <p>No widgets in this area</p>
                <p className="text-sm">Add widgets from the left panel</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {widgets.map((widget, index) => (
                  <div key={widget.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {getWidgetTypeName(widget.widgetId)}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Position: {widget.position}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Move Up/Down */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveWidget(widget.id, 'up')}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleMoveWidget(widget.id, 'down')}
                            disabled={index === widgets.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Edit */}
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit Widget"
                        >
                          ⚙️
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteWidget(widget.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Widget"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

