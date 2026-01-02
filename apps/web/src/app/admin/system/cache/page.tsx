'use client';

import { useState } from 'react';
import { systemApi } from '@/lib/api/system';

export default function CacheManagementPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear all cache? This action will enqueue a cache clear job.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await systemApi.clearCache();
      
      if (response.success) {
        setMessage('Cache clear job has been enqueued successfully. The cache will be cleared shortly.');
      } else {
        setError(response.error || 'Failed to enqueue cache clear job');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cache-management">
      <div className="cache-header">
        <h1>Cache Management</h1>
      </div>

      <div className="cache-content">
        <div className="card">
          <h2>Clear Cache</h2>
          <p>
            This will enqueue a cache clear job that will remove all cached data.
            The job will be processed by the queue worker.
          </p>

          {message && (
            <div className="alert alert-success" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleClearCache}
            disabled={loading}
            className="btn btn-primary"
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Processing...' : 'Clear Cache'}
          </button>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Cache Information</h3>
          <p>
            Cache is managed through the MySQL-backed queue system. When you clear the cache,
            a job is enqueued and processed by the worker process.
          </p>
          <p>
            To view the status of cache clear jobs, visit the{' '}
            <a href="/admin/system/jobs">Jobs Dashboard</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

