'use client';

import { useEffect, useState } from 'react';
import { systemApi, Job, FailedJob } from '@/lib/api/system';

export default function JobsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [failedJobs, setFailedJobs] = useState<FailedJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'all'>('all');

  useEffect(() => {
    loadJobs();
    // Refresh every 5 seconds
    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await systemApi.getJobs({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 50,
      });
      
      if (response.success) {
        setJobs(response.data.jobs);
        setFailedJobs(response.data.failedJobs);
        setError(null);
      } else {
        setError('Failed to load jobs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryFailedJob = async (uuid: string, jobName?: string) => {
    if (!confirm('Are you sure you want to retry this failed job?')) {
      return;
    }

    try {
      // Try to extract job name from payload if not provided
      if (!jobName) {
        const failedJob = failedJobs.find(j => j.uuid === uuid);
        if (failedJob) {
          try {
            const payload = JSON.parse(failedJob.payload);
            jobName = payload.name;
          } catch (e) {
            // If we can't parse, prompt user
            jobName = prompt('Please enter the job name:');
            if (!jobName) return;
          }
        }
      }

      await systemApi.retryFailedJob(uuid, jobName || 'unknown');
      loadJobs();
    } catch (err: any) {
      alert(err.message || 'Failed to retry job');
    }
  };

  const handleDeleteFailedJob = async (uuid: string) => {
    if (!confirm('Are you sure you want to delete this failed job?')) {
      return;
    }

    try {
      await systemApi.deleteFailedJob(uuid);
      loadJobs();
    } catch (err: any) {
      alert(err.message || 'Failed to delete job');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'QUEUED':
        return '#6c757d';
      case 'PROCESSING':
        return '#007bff';
      case 'COMPLETED':
        return '#28a745';
      case 'FAILED':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading && jobs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="jobs-dashboard">
      <div className="jobs-header">
        <h1>Queue Jobs Dashboard</h1>
        <div className="filter-controls" style={{ marginTop: '1rem' }}>
          <label>
            Filter by status:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
            >
              <option value="all">All</option>
              <option value="QUEUED">Queued</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>
          </label>
          <button
            onClick={loadJobs}
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div className="jobs-content" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h2>Active Jobs ({jobs.length})</h2>
          {jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Queue</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Attempts</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Run At</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '0.75rem' }}>{job.id}</td>
                    <td style={{ padding: '0.75rem' }}>{job.name}</td>
                    <td style={{ padding: '0.75rem' }}>{job.queue}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: getStatusColor(job.status),
                          color: 'white',
                          fontSize: '0.875rem',
                        }}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {job.attempts} / {job.maxAttempts}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {new Date(job.runAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {new Date(job.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>Failed Jobs ({failedJobs.length})</h2>
          {failedJobs.length === 0 ? (
            <p>No failed jobs.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>UUID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Queue</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Failed At</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Exception</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {failedJobs.map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {job.uuid.substring(0, 8)}...
                    </td>
                    <td style={{ padding: '0.75rem' }}>{job.queue}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {new Date(job.failedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.75rem', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {job.exception.substring(0, 100)}...
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => handleRetryFailedJob(job.uuid)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          marginRight: '0.5rem',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        Retry
                      </button>
                      <button
                        onClick={() => handleDeleteFailedJob(job.uuid)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

