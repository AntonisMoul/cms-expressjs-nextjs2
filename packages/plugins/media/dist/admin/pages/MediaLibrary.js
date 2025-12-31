'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaLibrary = MediaLibrary;
const react_1 = __importStar(require("react"));
const ui_1 = require("@cms/ui");
function MediaLibrary({}) {
    const [files, setFiles] = (0, react_1.useState)([]);
    const [folders, setFolders] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [selectedFiles, setSelectedFiles] = (0, react_1.useState)([]);
    const [currentFolder, setCurrentFolder] = (0, react_1.useState)(null);
    const [viewMode, setViewMode] = (0, react_1.useState)('grid');
    const [uploading, setUploading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        fetchMedia();
    }, [currentFolder]);
    const fetchMedia = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (currentFolder) {
                params.set('folderId', currentFolder.toString());
            }
            const [filesResponse, foldersResponse] = await Promise.all([
                fetch(`/api/v1/media/files?${params}`, {
                    credentials: 'include',
                }),
                fetch('/api/v1/media/folders/tree', {
                    credentials: 'include',
                }),
            ]);
            if (filesResponse.ok) {
                const filesData = await filesResponse.json();
                setFiles(filesData.data.files);
            }
            if (foldersResponse.ok) {
                const foldersData = await foldersResponse.json();
                setFolders(foldersData.data.folders);
            }
        }
        catch (error) {
            console.error('Failed to fetch media:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0)
            return;
        setUploading(true);
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });
            if (currentFolder) {
                formData.append('folderId', currentFolder.toString());
            }
            const response = await fetch('/api/v1/media/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            if (response.ok) {
                await fetchMedia();
            }
            else {
                console.error('Upload failed');
            }
        }
        catch (error) {
            console.error('Upload error:', error);
        }
        finally {
            setUploading(false);
            event.target.value = ''; // Reset file input
        }
    };
    const handleFileSelect = (fileId, selected) => {
        if (selected) {
            setSelectedFiles(prev => [...prev, fileId]);
        }
        else {
            setSelectedFiles(prev => prev.filter(id => id !== fileId));
        }
    };
    const handleBulkDelete = async () => {
        if (selectedFiles.length === 0)
            return;
        try {
            const promises = selectedFiles.map(fileId => fetch(`/api/v1/media/files/${fileId}`, {
                method: 'DELETE',
                credentials: 'include',
            }));
            await Promise.all(promises);
            await fetchMedia();
            setSelectedFiles([]);
        }
        catch (error) {
            console.error('Bulk delete failed:', error);
        }
    };
    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith('image/')) {
            return 'ti ti-photo';
        }
        else if (mimeType.startsWith('video/')) {
            return 'ti ti-video';
        }
        else if (mimeType.startsWith('audio/')) {
            return 'ti ti-music';
        }
        else if (mimeType.includes('pdf')) {
            return 'ti ti-file-text';
        }
        else {
            return 'ti ti-file';
        }
    };
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <div className="flex gap-2">
          <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer">
            <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={uploading}/>
            {uploading ? 'Uploading...' : 'Upload Files'}
          </label>
          {selectedFiles.length > 0 && (<ui_1.Button variant="secondary" onClick={handleBulkDelete}>
              Delete Selected ({selectedFiles.length})
            </ui_1.Button>)}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button onClick={() => setCurrentFolder(null)} className={`hover:text-blue-600 ${currentFolder === null ? 'text-blue-600 font-medium' : ''}`}>
          All Files
        </button>
        {currentFolder && (<>
            <span>/</span>
            <span className="text-blue-600 font-medium">
              {folders.find(f => f.id === currentFolder)?.name || 'Unknown Folder'}
            </span>
          </>)}
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (<div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading media...</div>
        </div>) : (<div className="space-y-6">
          {/* Folders */}
          {folders.length > 0 && (<div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Folders</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders.map((folder) => (<div key={folder.id} onClick={() => setCurrentFolder(folder.id)} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0"/>
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-900 truncate">{folder.name}</div>
                    <div className="text-xs text-gray-500">{folder.fileCount} files</div>
                  </div>))}
              </div>
            </div>)}

          {/* Files */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Files</h3>
            {files.length === 0 ? (<div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="none" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 3a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h16v14H4V5zm2 2v10h12V7H6zm2 2h8v6H8V9z"/>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading your first file.</p>
              </div>) : viewMode === 'grid' ? (<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {files.map((file) => (<div key={file.id} className={`relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''}`}>
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      {file.mimeType.startsWith('image/') ? (<img src={file.thumbnailUrl || file.url} alt={file.alt || file.name} className="w-full h-full object-cover"/>) : (<div className="text-2xl">
                          <i className={getFileIcon(file.mimeType)}></i>
                        </div>)}
                    </div>

                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(file.fileSize)}
                      </div>
                    </div>

                    <input type="checkbox" className="absolute top-2 left-2 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500" checked={selectedFiles.includes(file.id)} onChange={(e) => handleFileSelect(file.id, e.target.checked)} onClick={(e) => e.stopPropagation()}/>
                  </div>))}
              </div>) : (<div className="bg-white shadow-sm border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedFiles.length === files.length && files.length > 0} onChange={(e) => {
                    if (selectedFiles.length === files.length) {
                        setSelectedFiles([]);
                    }
                    else {
                        setSelectedFiles(files.map(f => f.id));
                    }
                }}/>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {files.map((file) => (<tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedFiles.includes(file.id)} onChange={(e) => handleFileSelect(file.id, e.target.checked)}/>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            {file.mimeType.startsWith('image/') ? (<img src={file.thumbnailUrl || file.url} alt={file.alt || file.name} className="w-10 h-10 object-cover rounded"/>) : (<i className={`${getFileIcon(file.mimeType)} text-gray-600`}></i>)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          {file.description && (<div className="text-sm text-gray-500 truncate max-w-xs">
                              {file.description}
                            </div>)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {file.mimeType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatFileSize(file.fileSize)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>)}
          </div>
        </div>)}
    </div>);
}
