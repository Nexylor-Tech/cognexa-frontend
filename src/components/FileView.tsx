import React, { useRef, useState } from 'react';
import { Upload, File as FileIcon, Loader } from 'lucide-react';
import type { FileItem } from '../types';
import { dataApi } from '../services/api';

interface FileViewProps {
  projectId: string;
  files: FileItem[];
  onFileUploaded: () => void;
}

export const FileView: React.FC<FileViewProps> = ({ projectId, files, onFileUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      // 1. Get Signed URL
      const { signedUrl, path } = await dataApi.getSignedUrl(projectId, file.name, file.type);

      // 2. Upload to S3 (Directly)
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to storage');
      }

      // 3. Confirm with Backend
      await dataApi.confirmUpload(projectId, file.name, path, file.type, file.size);

      // 4. Refresh list
      onFileUploaded();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text mb-2">Files</h2>
          <p className="text-subtle">Manage project files and assets</p>
        </div>
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-pine text-surface px-4 py-2 rounded flex items-center gap-2 hover:bg-foam transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? <Loader className="animate-spin" size={18} /> : <Upload size={18} />}
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-love/10 border border-love/20 text-love p-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {files.length === 0 && (
          <div className="text-center py-10 bg-overlay/30 rounded border border-dashed border-muted text-muted">
            No files uploaded yet.
          </div>
        )}
        {files.map((file) => (
          <div key={file.id} className="bg-surface p-4 rounded border border-overlay hover:border-muted transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-3 bg-iris/10 text-iris rounded-lg">
                <FileIcon size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-text truncate pr-4" title={file.name}>
                  {file.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-subtle mt-1">
                  <span>{formatSize(file.size)}</span>
                  <span>•</span>
                  <span>Uploaded by {file.uploader.name || file.uploader.email}</span>
                  <span>•</span>
                  <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            {/* Can add download/delete actions here later */}
          </div>
        ))}
      </div>
    </div>
  );
};
