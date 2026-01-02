'use client';

import { useEffect, useState } from 'react';
import { systemApi, SitemapStatus } from '@/lib/api/system';

export default function SitemapManagementPage() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState<SitemapStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const response = await systemApi.getSitemapStatus();
      
      if (response.success && response.data) {
        setStatus(response.data);
      } else {
        setError(response.error || 'Failed to load sitemap status');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load sitemap status');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!confirm('Are you sure you want to generate a new sitemap? This will enqueue a sitemap generation job.')) {
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      setMessage(null);

      const response = await systemApi.generateSitemap();
      
      if (response.success) {
        setMessage('Sitemap generation job has been enqueued successfully. The sitemap will be generated shortly.');
        // Reload status after a short delay
        setTimeout(() => {
          loadStatus();
        }, 2000);
      } else {
        setError(response.error || 'Failed to enqueue sitemap generation job');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate sitemap');
    } finally {
      setGenerating(false);
    }
  };

  if (loading && !status) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sitemap-management">
      <div className="sitemap-header">
        <h1>Sitemap Management</h1>
      </div>

      <div className="sitemap-content">
        <div className="card">
          <h2>Generate Sitemap</h2>
          <p>
            Generate an XML sitemap containing all published pages, posts, and categories.
            The sitemap will be saved to <code>/public/sitemap.xml</code>.
          </p>

          {status && (
            <div className="status-info" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <p><strong>Status:</strong> {status.enabled ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Items per page:</strong> {status.itemsPerPage}</p>
              {status.lastGenerated && (
                <p>
                  <strong>Last generated:</strong>{' '}
                  {new Date(status.lastGenerated).toLocaleString()}
                </p>
              )}
            </div>
          )}

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
            onClick={handleGenerate}
            disabled={generating}
            className="btn btn-primary"
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: generating ? 'not-allowed' : 'pointer',
              opacity: generating ? 0.6 : 1,
            }}
          >
            {generating ? 'Generating...' : 'Generate Sitemap'}
          </button>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Sitemap Information</h3>
          <p>
            The sitemap includes all published content:
          </p>
          <ul>
            <li>Published pages</li>
            <li>Published blog posts</li>
            <li>Published categories</li>
          </ul>
          <p>
            The sitemap is automatically regenerated when content is published or deleted.
            You can also manually trigger generation using the button above.
          </p>
          <p>
            To view the status of sitemap generation jobs, visit the{' '}
            <a href="/admin/system/jobs">Jobs Dashboard</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

