'use client';

import { useState, useEffect } from 'react';
import { SystemInfo, SystemStats } from '../../models/types';

export default function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      const [infoResponse, statsResponse] = await Promise.all([
        fetch('/api/system/info'),
        fetch('/api/system/stats')
      ]);

      if (!infoResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch system data');
      }

      const [info, stats] = await Promise.all([
        infoResponse.json(),
        statsResponse.json()
      ]);

      setSystemInfo(info);
      setSystemStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">System Information</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of system status and statistics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={fetchSystemData}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* System Info Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">S</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Version</dt>
                  <dd className="text-lg font-medium text-gray-900">{systemInfo?.version}</dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>Environment: {systemInfo?.environment}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span>Uptime: {systemInfo ? formatUptime(systemInfo.uptime) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Database Status Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  systemInfo?.database.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  <span className="text-white text-sm font-medium">DB</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Database</dt>
                  <dd className={`text-lg font-medium ${
                    systemInfo?.database.status === 'connected' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {systemInfo?.database.status}
                  </dd>
                </dl>
              </div>
            </div>
            {systemInfo?.database.queryCount && (
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span>Queries: {systemInfo.database.queryCount.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Memory Usage Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">M</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Memory Usage</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {systemInfo ? `${systemInfo.memory.percentage}%` : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>Used: {systemInfo ? formatBytes(systemInfo.memory.used) : 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span>Total: {systemInfo ? formatBytes(systemInfo.memory.total) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics Overview</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Redirects */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">R</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Redirects</dt>
                    <dd className="text-lg font-medium text-gray-900">{systemStats?.redirects.total || 0}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div>Active: {systemStats?.redirects.active || 0}</div>
                <div>Hits: {systemStats?.redirects.hits.toLocaleString() || 0}</div>
              </div>
            </div>
          </div>

          {/* Cache */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">C</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Cache Entries</dt>
                    <dd className="text-lg font-medium text-gray-900">{systemStats?.cache.entries || 0}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div>Size: {systemStats ? formatBytes(systemStats.cache.totalSize) : '0 B'}</div>
              </div>
            </div>
          </div>

          {/* Sitemap */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">S</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Sitemap URLs</dt>
                    <dd className="text-lg font-medium text-gray-900">{systemStats?.sitemap.total || 0}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div>Active: {systemStats?.sitemap.active || 0}</div>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">L</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">System Logs</dt>
                    <dd className="text-lg font-medium text-gray-900">Today: {systemStats?.logs.today || 0}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div>Errors: {systemStats?.logs.errors || 0}</div>
                <div>Warnings: {systemStats?.logs.warnings || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
