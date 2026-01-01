'use client';

import { useState, useEffect } from 'react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface MediaFolder {
  id: string;
  name?: string;
  parentId: string;
  color?: string;
  children: MediaFolder[];
}

export default function MediaPage() {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [currentFolder, setCurrentFolder] = useState('0');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFolders();
    fetchFiles();
  }, [currentFolder]);

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/media/folders');
      const result = await response.json();

      if (result.success) {
        setFolders(result.data.folders);
      }
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/media/files?folderId=${currentFolder}`);
      const result = await response.json();

      if (result.success) {
        setFiles(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      formData.append('folderId', currentFolder);

      const response = await fetch('/api/media/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchFiles(); // Refresh file list
      }
    } catch (error) {
      console.error('Failed to upload files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/media/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFiles(files.filter(file => file.id !== fileId));
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType === 'application/pdf') return '📄';
    return '📁';
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
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <div className="flex gap-4">
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
            {uploading ? 'Uploading...' : 'Upload Files'}
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
          </label>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Create Folder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Folders Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">Folders</h2>
            <div className="space-y-2">
              <button
                onClick={() => setCurrentFolder('0')}
                className={`w-full text-left px-3 py-2 rounded ${
                  currentFolder === '0'
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                📁 All Files
              </button>
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setCurrentFolder(folder.id)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    currentFolder === folder.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  📁 {folder.name || 'Unnamed Folder'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Files Grid */}
        <div className="col-span-9">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">
                Files {files.length > 0 && `(${files.length})`}
              </h2>
            </div>

            {files.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-4">📁</div>
                <p>No files in this folder</p>
                <p className="text-sm">Upload some files to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                {files.map(file => (
                  <div key={file.id} className="group relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {file.mimeType.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {getFileIcon(file.mimeType)}
                        </div>
                      )}
                    </div>

                    <div className="mt-2">
                      <p className="text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    {/* Action buttons - shown on hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <button
                          onClick={() => {/* Copy URL */}}
                          className="bg-white bg-opacity-90 hover:bg-opacity-100 p-1 rounded text-xs"
                          title="Copy URL"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs"
                          title="Delete"
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

