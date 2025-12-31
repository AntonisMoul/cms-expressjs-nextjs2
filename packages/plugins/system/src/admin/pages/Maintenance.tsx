'use client';

import { useState, useEffect } from 'react';
import { MaintenanceTask } from '../../models/types';

export default function Maintenance() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [runningTasks, setRunningTasks] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenanceTasks();
  }, []);

  const fetchMaintenanceTasks = async () => {
    try {
      const response = await fetch('/api/system/maintenance/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const runTask = async (taskId: string) => {
    setRunningTasks(prev => new Set(prev).add(taskId));

    try {
      const response = await fetch(`/api/system/maintenance/tasks/${taskId}/run`, {
        method: 'POST'
      });

      const result = await response.json();
      setResults(prev => ({ ...prev, [taskId]: result }));
    } catch (err) {
      setResults(prev => ({
        ...prev,
        [taskId]: {
          success: false,
          message: err instanceof Error ? err.message : 'Task failed'
        }
      }));
    } finally {
      setRunningTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
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
          <h1 className="text-2xl font-semibold text-gray-900">System Maintenance</h1>
          <p className="mt-2 text-sm text-gray-700">
            Run maintenance tasks to optimize system performance and clean up data.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={fetchMaintenanceTasks}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Refresh Tasks
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="space-y-6">
          {tasks.map((task) => {
            const isRunning = runningTasks.has(task.id);
            const result = results[task.id];

            return (
              <div key={task.id} className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        Estimated duration: {formatDuration(task.estimatedDuration)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => runTask(task.id)}
                        disabled={isRunning}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                          isRunning
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                      >
                        {isRunning ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Running...
                          </>
                        ) : (
                          'Run Task'
                        )}
                      </button>
                    </div>
                  </div>

                  {result && (
                    <div className={`mt-4 p-4 rounded-md ${
                      result.success
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          {result.success ? (
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${
                            result.success ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {result.success ? 'Task completed successfully' : 'Task failed'}
                          </p>
                          <p className={`text-sm mt-1 ${
                            result.success ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {result.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No maintenance tasks available.</p>
        </div>
      )}
    </div>
  );
}
