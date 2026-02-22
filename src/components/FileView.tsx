import React, { useRef, useState } from 'react';
import { Upload, Loader, FileText, AlertCircle } from 'lucide-react';
import type { FileItem } from '../types';
import { dataApi } from '../services/api';

interface FileViewProps {
  projectId: string;
  files: FileItem[];
  onFileUploaded: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.csv'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/vnd.ms-excel',
  'application/csv'
];

export const FileView: React.FC<FileViewProps> = ({ projectId, files, onFileUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit. (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension);

    // Check mime type if browser detects it
    const isValidMime = ALLOWED_MIME_TYPES.includes(file.type) || !file.type; // Allow empty if browser fails to detect, rely on extension then

    if (!isValidExtension || !isValidMime) {
      return `Invalid file type. Only .pdf, .txt, .csv allowed.`;
    }

    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processUpload(file);
    }
  };

  const processUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    await handleUpload(file);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]; // Handle only first file for now
      await processUpload(file);
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
    <div
      className="max-w-4xl mx-auto h-full flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text mb-2">Files</h2>
          <p className="text-subtle">Manage project files and assets (PDF, TXT, CSV up to 10MB)</p>
        </div>
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.txt,.csv"
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
        <div className="bg-love/10 border border-love/20 text-love p-3 rounded mb-6 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Drop Zone Overlay or Style */}
      <div
        className={`flex-1 rounded-xl transition-all duration-200 border-2 
          ${isDragging
            ? 'border-iris bg-iris/5 scale-[1.01] shadow-xl'
            : 'border-transparent'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
          {files.length === 0 && (
            <div className={`col-span-full text-center py-20 rounded border-2 border-dashed transition-colors
                ${isDragging ? 'border-iris bg-iris/10 text-iris' : 'bg-overlay/30 border-muted text-muted'}`}>
              <div className="flex flex-col items-center gap-2">
                <Upload size={32} className={isDragging ? 'animate-bounce' : ''} />
                <p>
                  {isDragging ? 'Drop file to upload' : 'No files uploaded yet. Drag & drop or click Upload.'}
                </p>
                <p className="text-xs text-subtle">Supported: .pdf, .txt, .csv (Max 10MB)</p>
              </div>
            </div>
          )}

          {/* If dragging over existing list, show a drop indicator */}
          {files.length > 0 && isDragging && (
            <div className="col-span-full p-8 border-2 border-dashed border-iris bg-iris/10 text-iris rounded-lg text-center mb-4 animate-pulse">
              Drop to upload
            </div>
          )}

          {files.map((file) => (
            <div key={file.id} className="bg-surface p-4 rounded border border-overlay hover:border-muted transition-colors flex flex-col items-start gap-3 group relative h-full">
              <div className="p-3 bg-iris/10 text-iris rounded-lg mb-1">
                <FileText size={24} />
              </div>
              <div className="min-w-0 w-full">
                <h3 className="font-medium text-text truncate w-full" title={file.name}>
                  {file.name}
                </h3>
                <div className="flex flex-col gap-1 text-xs text-subtle mt-2">
                  <span className="truncate">By {file.uploader.name || file.uploader.email}</span>
                  <div className="flex justify-between items-center w-full mt-1">
                    <span>{formatSize(file.size)}</span>
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
